import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { Book } from '../models/Book.ts'
import { useBookContext } from '../context/BooksContext'
import MyNavbar from '../components/Navbar/Navbar.tsx'
import { Review } from '../models/Review'
import ReviewCardAdmin from '../components/Review/ReviewCardAdmin'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, deleteBook, getReviewsByBookId } = useBookContext()
    const [book, setBook] = useState<Book | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [averageRating, setAverageRating] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const bookId = parseInt(id, 10)
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(bookId)
                if (!bookData) {
                    setError('Book not found.')
                } else {
                    setBook(bookData)
                }
            } catch (error) {
                setError(error.message || 'Book not found.')
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [bookId, getBookById])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviewsByBookId(bookId)
                setReviews(reviewsData)

                const totalRating = reviewsData.reduce(
                    (sum, review) => sum + review.rating,
                    0
                )
                const avgRating =
                    reviewsData.length > 0
                        ? totalRating / reviewsData.length
                        : null
                setAverageRating(avgRating)
            } catch (error) {
                console.error('Error fetching reviews:', error)
                setReviews([])
            }
        }
        fetchReviews()
    }, [bookId, getReviewsByBookId])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`)
    }

    const handleDeleteClick = async () => {
        try {
            await deleteBook(bookId!)
            navigate('/')
        } catch (error) {
            setError(error)
            setError('Failed to delete the book.')
        }
    }

    const handleDeleteReview = async () => {
        try {
            // await deleteReview(bookId!)
        } catch (error) {
            setError(error)
            setError('Failed to delete the review.')
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
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
                {/* First column - Image */}
                <div className="col-md-4">
                    <img
                        src={book!.image || undefined}
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
                    <p>
                        <strong>Category:</strong> {book!.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book!.price.toFixed(2)}
                    </p>
                    <div>
                        <strong>Rating:</strong>
                        <StarRating rating={book!.rating} size={30} />
                        {book!.rating} / 5
                    </div>
                    <p>
                        <strong>Available Count:</strong> {book!.availableCount}
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

            {/*Reviews*/}
            <div className="mt-5">
                <h3>Reviews</h3>
                <StarRating
                    rating={averageRating}
                    totalStars={5}
                    size={30}
                />{' '}
                <p>
                    <strong>Average Review Rating:</strong>{' '}
                    {averageRating ? averageRating.toFixed(2) : 'No rating'} / 5
                </p>
                <p>
                    <strong>Number of Reviews:</strong> {reviews.length}
                </p>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <React.Fragment key={review.review_id}>
                            <ReviewCardAdmin review={review} />
                        </React.Fragment>
                    ))
                ) : (
                    <p>No reviews available for this book.</p>
                )}
            </div>
        </div>
    )
}

export default BookViewAdminPage
