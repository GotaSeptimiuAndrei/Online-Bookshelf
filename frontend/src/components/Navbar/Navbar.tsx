import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { FaSearch } from 'react-icons/fa'
import { useAuthContext } from '../../context/AuthContext.tsx'
import { searchBooksByTitle } from '../../services/booksApi'
import { Book } from '../../models/Book'

const MyNavbar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Book[]>([]) // Holds fetched results
    const [error, setError] = useState<string | null>(null)
    const { logout } = useAuthContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    // Debounced searchTerm state to reduce API calls during typing
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)

    // Debounce effect to delay search actions
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm)
        }, 500) // Delay of 500ms

        return () => {
            clearTimeout(timer) // Clear timeout on cleanup
        }
    }, [searchTerm])

    // Fetch search results when the debounced term changes
    useEffect(() => {
        if (debouncedTerm.trim()) {
            handleSearch(debouncedTerm)
        } else {
            setSearchResults([]) // Clear results if term is empty
        }
    }, [debouncedTerm])

    const [isDropdownVisible, setDropdownVisible] = useState(false)

    const categories = [
        'Fiction',
        'Non-Fiction',
        'Science',
        'Biography',
        'Fantasy',
        'Mystery',
        'Romance',
        'History',
        'Horror',
    ]

    const handleSearchIconClick = () => {
        setSearchVisible(!searchVisible)
    }

    const handleSearch = async (term: string) => {
        try {
            setError(null) // Clear previous errors
            const results = await searchBooksByTitle(term) // Fetch search results
            setSearchResults(results) // Set results into state
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to fetch search results')
            } else {
                setError('An unexpected error occurred')
            }
            setSearchResults([])
        }
    }

    const handleItemClick = (bookId: string) => {
        navigate(`/books/${bookId}`) // Navigate to the specific book's page
        setSearchVisible(false) // Hide search results after selection
    }

    const handleLogin = () => {
        navigate('/pageTurner')
    }

    const handleCategoryClick = (category: string) => {
        navigate(`/bookshelf?category=${encodeURIComponent(category)}`)
    }
    return (
        <Navbar expand="lg" fixed="top" className="custom-navbar">
            <Link to="/" className="navbar-brand">
                Page Turners
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto custom-nav">
                    <Nav.Link href="/" className="nav-link">
                        Home
                    </Nav.Link>

                    <div
                        className="nav-item bookshelf-container"
                        onMouseEnter={() => setDropdownVisible(true)}
                        onMouseLeave={() => setDropdownVisible(false)}
                    >
                        <Nav.Link href="/bookshelf" className="nav-link">
                            Bookshelf
                        </Nav.Link>
                        <div
                            className={`dropdown-content ${
                                isDropdownVisible ? 'visible' : ''
                            }`}
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            <div className="books-dropdown">
                                {categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Nav.Link href="/favorites" className="nav-link">
                        Favorite Books
                    </Nav.Link>
                    <Nav.Link href="#my-account" className="nav-link">
                        My Account
                    </Nav.Link>
                    <Nav.Link href="/loans" className="nav-link">
                        Loans Books
                    </Nav.Link>

                    {user ? (
                        <button onClick={logout} className="btn btn-primary">
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="btn btn-primary"
                        >
                            Log in
                        </button>
                    )}
                </Nav>
            </Navbar.Collapse>

            <div className="search-container">
                <Form
                    className={`search-form ${searchVisible ? 'visible' : 'hidden'}`}
                >
                    <FormControl
                        type="text"
                        placeholder="Search"
                        className="mt-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm as user types
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            <ul>
                                {searchResults.map((book) => (
                                    <li
                                        key={book.bookId}
                                        className="search-result-item"
                                        onClick={() =>
                                            handleItemClick(book.bookId || '')
                                        }
                                    >
                                        <div className="search-result-content">
                                            <img
                                                src={
                                                    book.imageUrl ||
                                                    'https://via.placeholder.com/64'
                                                }
                                                alt={book.title}
                                                className="search-result-image"
                                            />
                                            <div className="search-result-details">
                                                <p className="search-result-title">
                                                    {book.title}
                                                </p>
                                                <p className="search-result-author">
                                                    {book.author}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {error && <div className="search-error">{error}</div>}
                </Form>
                <FaSearch
                    className="search-icon"
                    onClick={handleSearchIconClick}
                />
            </div>
        </Navbar>
    )
}

export default MyNavbar
