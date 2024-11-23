import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { fetchBookById } from '../../services/api.ts'
import { Book } from '../../models/Book.ts'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookUserPage.css'

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await fetchBookById(id!)
                setBook(bookData)
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
    }, [id])

    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    if (error) {
        return <div className="container mt-5">Error: {error}</div>
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
                        src={book.imageUrl || undefined}
                        alt={book.title}
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-4">
                    <h2 className="title">{book!.title}</h2>
                    <h5 className="author">{book!.author}</h5>
                    <p className="description">{book!.description}</p>
                </div>
                <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
                    <p>
                        <strong>Category:</strong> {book.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                    </p>
                    <p>
                        <strong>Rating:</strong>
                        <StarRating rating={book.rating} />
                        {book.rating} / 5
                    </p>
                    <p>
                        <strong>Available Count:</strong> {book.availableCount}
                    </p>
                    <div className="d-flex mt-3">
                        <button className="btn btn-primary">Add to Cart</button>
                        <button className="btn btn-light">
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookViewUserPage
