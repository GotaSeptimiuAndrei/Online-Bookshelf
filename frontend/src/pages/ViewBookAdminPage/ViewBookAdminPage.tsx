import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating'
import { Book } from '../../models/Book'
import { useBookContext } from '../../context/BooksContext'
import MyNavbar from '../../components/Navbar/Navbar'
import './ViewBookAdminPage.css'
import { useReviewsContext } from '../../context/ReviewsContext'
import ReviewCardAdmin from '../../components/Review/ReviewCardAdmin'
import { Review } from '../../models/Review'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, deleteBook } = useBookContext()
    const { deleteReview } = useReviewsContext()
    const { reviews, loadReviewsByBookId } = useReviewsContext()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleted, setIsDeleted] = useState(false)

    useEffect(() => {
        if (isDeleted) return
        ;(async () => {
            try {
                const bookData = await getBookById(id!)
                if (!bookData) {
                    setError('Book not found.')
                    return
                }
                setBook(bookData)
                await loadReviewsByBookId(id!)
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : 'Book not found.'
                )
            } finally {
                setLoading(false)
            }
        })()
    }, [id, getBookById, loadReviewsByBookId, isDeleted])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`)
    }

    const handleBookDeleteClick = async () => {
        // TODO: DUPA CE SE APASA PE BUTONUL DE DELETE, SE EXECUTA DIN NOU USE EFFECT SI TOT APARI ERORI IN CONSOLA CA CARTEANU POATE FI GASITA
        try {
            await deleteBook(id!)
            setIsDeleted(true)
            navigate('/bookshelf')
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete the book'
            )
        }
    }
    const handleReviewDeleteClick = async (reviewId: number) => {
        try {
            await deleteReview(reviewId)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete the review'
            )
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
                {/* First column - Image */}
                <div className="col-md-4">
                    <img
                        // cream un URL temporar pentru fisier pt a fi utilizat ca src
                        src={
                            book.image instanceof File
                                ? URL.createObjectURL(book.image)
                                : book.image || undefined
                        }
                        alt={book.title}
                        className="img-fluid"
                    />
                </div>

                {/* Second column - Title, Author, and Description */}
                <div className="col-md-4">
                    <h2 className="title">{book.title}</h2>
                    <h5 className="author">{book.author}</h5>
                    <p className="description">{book.description}</p>
                </div>

                {/* Third column - Additional Information */}
                <div className="col-md-4 additional-info">
                    <p>
                        <strong>Category:</strong> {book.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                    </p>
                    <div>
                        <strong>Rating:</strong>
                        <StarRating rating={book.rating} />
                        {book.rating} / 5
                    </div>
                    <p>
                        <strong>Available Count:</strong> {book.availableCount}
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpdateClick}
                    >
                        Update this Book
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleBookDeleteClick}
                    >
                        Delete this Book
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h3>Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews for this book yet.</p>
                ) : (
                    reviews.map((review: Review) => (
                        // TODO: Warning: Each child in a list should have a unique "key" prop.
                        <React.Fragment key={review.reviewId}>
                            <ReviewCardAdmin
                                review={review}
                                onDelete={handleReviewDeleteClick}
                            />
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    )
}

export default BookViewAdminPage
