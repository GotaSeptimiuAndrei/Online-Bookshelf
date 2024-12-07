import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { Book } from '../../models/Book.ts'
import { useBookContext } from '../../context/BooksContext.tsx'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookAdminPage.css'
import { useReviewsContext } from '../../context/ReviewsContext'
import { Review } from '../../models/Review'
import ReviewCardAdmin from '../../components/Review/ReviewCardAdmin'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, deleteBook } = useBookContext()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { deleteReview } = useReviewsContext()
    const { reviews, loadReviewsByBookId } = useReviewsContext()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(id!)
                if (!bookData) {
                    setError('Book not found.')
                } else {
                    setBook(bookData)
                    await loadReviewsByBookId(id!)
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
    }, [id, getBookById, loadReviewsByBookId])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`)
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

    const generalRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0

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

            {/* General Rating Section */}
            <div className="d-flex flex-column align-items-center mt-4">
                <h3>General Rating and Reviews</h3>
                <div className="d-flex align-items-center">
                    <strong>General Rating:</strong>
                    <div className="ms-2">
                        <StarRating
                            rating={generalRating}
                            totalStars={5}
                            size={30}
                        />
                    </div>
                </div>
                <p>
                    <strong>Number of Reviews:</strong> {reviews.length}
                </p>
            </div>

            {/* All Reviews Section */}
            <div className="mt-4">
                <h3>All Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews for this book yet.</p>
                ) : (
                    <div className="row">
                        {reviews.map((review: Review) => (
                            <React.Fragment key={review.reviewId}>
                                <ReviewCardAdmin
                                    review={review}
                                    onDelete={handleReviewDeleteClick}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookViewAdminPage
