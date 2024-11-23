import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { Book } from '../../models/Book.ts'
import { useBookContext } from '../../context/BooksContext.tsx'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookAdminPage.css'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, deleteBook } = useBookContext()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(id!)
                if (!bookData) {
                    setError('Book not found.')
                } else {
                    setBook(bookData)
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Book not found.')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id, getBookById])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`) // Navigate to the edit page
    }

    const handleDeleteClick = async () => {
        try {
            await deleteBook(id!)
            navigate('/bookshelf')
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Failed to delete the book')
            }
        }
    }

    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    if (error) {
        return <div className="container mt-5">{error}</div>
    }

    if (!book) {
        return <div className="container mt-5">Book not found.</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br />
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={book!.imageUrl || undefined}
                        alt={book!.title}
                        className="img-fluid"
                    />
                </div>

                <div className="col-md-4">
                    <h2 className="title">{book!.title}</h2>
                    <h5 className="author">{book!.author}</h5>
                    <p className="description">{book!.description}</p>
                </div>

                <div className="col-md-4 additional-info">
                    <p>
                        <strong>Category:</strong> {book!.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book!.price.toFixed(2)}
                    </p>
                    <div>
                        <strong>Rating:</strong>
                        <StarRating rating={book!.rating} />
                        {book!.rating} / 5
                    </div>
                    <p>
                        <strong>Available Count:</strong> {book!.availableCount}
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpdateClick}
                    >
                        Update this Book
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleDeleteClick}
                    >
                        Delete this Book
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookViewAdminPage
