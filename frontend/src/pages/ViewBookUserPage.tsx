import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Book } from '../models/Book.ts'
import MyNavbar from '../components/Navbar/Navbar.tsx'
import { useBookContext } from '../context/BooksContext'
import { Review } from '../models/Review'
import ReviewCardUser from '../components/Review/ReviewCardUser'
import { Button, Card, Form } from 'react-bootstrap'

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const bookId = parseInt(id, 10)
    const { getBookById, getReviewsByBookId } = useBookContext()
    const [book, setBook] = useState<Book | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [averageRating, setAverageRating] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [newRating, setNewRating] = useState<number>(0)
    const [newDescription, setNewDescription] = useState<string>('')
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(bookId!)
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

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            console.log('haha')
            // const newReview = {
            //     review_id: Date.now(),
            //     book_id: bookId,
            //     stars: newRating,
            //     description: newDescription,
            // }
            // await addReview(newReview)
            // setReviews([...reviews, newReview])
            // setNewRating(0)
            // setNewDescription('')
        } catch (error) {
            console.error('Error adding review:', error)
        }
    }

    if (loading) return <div className="container mt-5">Loading...</div>
    if (error) return <div className="container mt-5">Error: {error}</div>
    if (!book) return <div className="container mt-5">Book not found.</div>

    return (
        <div className="container mt-5">
            <MyNavbar />
            <div className="row mt-4">
                <div className="col-md-4">
                    <img
                        src={book.image || undefined}
                        alt={book.title}
                        className="img-fluid rounded"
                        style={{ maxWidth: '100%', width: '300px' }}
                    />
                </div>
                <div className="col-md-4">
                    <h2>{book.title}</h2>
                    <h5 className="text-muted">{book.author}</h5>
                    <p>{book.description}</p>
                </div>
                <div className="col-md-4 d-flex flex-column align-items-center">
                    <p>
                        <strong>Category:</strong> {book.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                    </p>
                    <p>
                        <strong>Rating:</strong>{' '}
                        <StarRating rating={book.rating} /> {book.rating} / 5
                    </p>
                    <p>
                        <strong>Available Count:</strong> {book.availableCount}
                    </p>
                    <div className="d-flex mt-3">
                        <Button variant="primary" className="me-2">
                            Add to Cart
                        </Button>
                        <Button variant="light">
                            <FontAwesomeIcon icon={faHeart} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-5">
                <h3>Reviews</h3>
                <div className="mb-3">
                    <StarRating
                        rating={averageRating}
                        totalStars={5}
                        size={30}
                    />
                    <p>
                        <strong>Average Rating:</strong>{' '}
                        {averageRating ? averageRating.toFixed(2) : 'No rating'}{' '}
                        / 5
                    </p>
                    <p>
                        <strong>Total Reviews:</strong> {reviews.length}
                    </p>
                </div>

                {/* Display reviews in a list */}
                <div className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <React.Fragment key={review.review_id}>
                                <ReviewCardUser review={review} />
                            </React.Fragment>
                        ))
                    ) : (
                        <p>No reviews available for this book.</p>
                    )}
                </div>
            </div>

            {/* Add New Review Section */}
            <Card className="mt-5">
                <Card.Body>
                    <h4 className="mb-3">Add Your Review</h4>
                    <Form onSubmit={handleAddReview}>
                        <Form.Group controlId="rating" className="mb-3">
                            <Form.Label>Rating:</Form.Label>
                            <StarRating
                                rating={newRating}
                                totalStars={5}
                                size={30}
                                setNewRating={setNewRating}
                            />
                        </Form.Group>
                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit Review
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BookViewUserPage
