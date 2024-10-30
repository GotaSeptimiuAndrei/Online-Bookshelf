import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { fetchBookById } from '../services/api' // Import your API functions
import { BookProps } from '../types/BookProps' // Import the Book type

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [book, setBook] = useState<BookProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await fetchBookById(id!) // Fetch book data from the API
                setBook(bookData)
            } catch (error) {
                setError('Book not found.')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`) // Navigate to the edit page
    }

    const handleDeleteClick = async () => {
        try {
            // await deleteBookById(id!) // Delete the book via API
            navigate('/books') // Navigate back to the books list
        } catch (error) {
            setError('Failed to delete the book.')
        }
    }

    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    if (error) {
        return <div className="container mt-5">{error}</div>
    }

    return (
        <div className="container mt-5">
            <div className="row">
                {/* First column - Image */}
                <div className="col-md-4">
                    <img
                        src={book!.coverImage}
                        alt={book!.title}
                        className="img-fluid"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            width: '300px',
                            borderRadius: '8px',
                        }}
                    />
                </div>

                {/* Second column - Title, Author, and Description */}
                <div className="col-md-4">
                    <h2 style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
                        {book!.title}
                    </h2>
                    <h5
                        style={{
                            textAlign: 'left',
                            marginTop: '0',
                            marginBottom: '1.5rem',
                            color: 'gray',
                        }}
                    >
                        {book!.author}
                    </h5>
                    <p style={{ textAlign: 'left', lineHeight: '1.5' }}>
                        {book!.description}
                    </p>
                </div>

                {/* Third column - Additional Information */}
                <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
                    {/*<p>*/}
                    {/*    <strong>Category:</strong> {book!.category}*/}
                    {/*</p>*/}
                    <p>
                        <strong>Price:</strong> ${book!.price.toFixed(2)}
                    </p>
                    <div>
                        <strong>Rating:</strong>
                        <StarRating rating={book!.rating} />
                        {book!.rating} / 5
                    </div>
                    <p>
                        <strong>Available Count:</strong> {book!.count}
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={handleUpdateClick}
                    >
                        Update this Book
                    </button>
                    <button
                        className="btn btn-primary mt-3"
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
