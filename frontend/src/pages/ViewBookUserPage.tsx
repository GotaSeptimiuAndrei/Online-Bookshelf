import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { fetchBookById } from '../services/api' // Import the function to fetch book data
import { BookProps } from '../types/BookProps' // Import your Book type

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const [book, setBook] = useState<BookProps | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchBookById(id)
                .then((bookData) => {
                    setBook(bookData)
                    setLoading(false)
                })
                .catch((error) => {
                    setError(error.message)
                    setLoading(false)
                })
        }
    }, [id])

    if (loading) return <div className="container mt-5">Loading...</div>
    if (error) return <div className="container mt-5">Error: {error}</div>
    if (!book) return <div className="container mt-5">Book not found.</div>

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="img-fluid"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            width: '300px',
                            borderRadius: '8px',
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <h2 style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
                        {book.title}
                    </h2>
                    <h5
                        style={{
                            textAlign: 'left',
                            marginTop: '0',
                            marginBottom: '1.5rem',
                            color: 'gray',
                        }}
                    >
                        {book.author}
                    </h5>
                    <p style={{ textAlign: 'left', lineHeight: '1.5' }}>
                        {book.description}
                    </p>
                </div>
                <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
                    {/*<p>*/}
                    {/*    <strong>Category:</strong> {book.category}*/}
                    {/*</p>*/}
                    <p>
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                    </p>
                    <p>
                        <strong>Rating:</strong>
                        <StarRating rating={book.rating} />
                        {book.rating} / 5
                    </p>
                    <p>
                        <strong>Available Count:</strong> {book.count}
                    </p>
                    <div className="d-flex mt-3">
                        <button className="btn btn-primary me-2">
                            Add to Cart
                        </button>
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
