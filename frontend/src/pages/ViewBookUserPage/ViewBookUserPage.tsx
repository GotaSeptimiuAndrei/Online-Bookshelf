import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Book } from '../../models/Book'
import MyNavbar from '../../components/Navbar/Navbar'
import './ViewBookUserPage.css'
import { Review } from '../../models/Review'
import ReviewCardUser from '../../components/Review/ReviewCardUser'
import { useBookContext } from '../../context/BooksContext'
import { useReviewsContext } from '../../context/ReviewsContext'
import { Button, Card, Form } from 'react-bootstrap'

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { getBookById } = useBookContext()
    const { addReview } = useReviewsContext()
    const [book, setBook] = useState<Book | null>(null)
    const { reviews, loadReviewsByBookId } = useReviewsContext()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [newRating, setNewRating] = useState<number>(0)
    const [newDescription, setNewDescription] = useState<string>('')
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
                setError(
                    error instanceof Error ? error.message : 'Book not found.'
                )
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id, getBookById, loadReviewsByBookId])

    if (loading) return <div className="container mt-5">Loading...</div>
    if (error) return <div className="container mt-5">Error: {error}</div>
    if (!book) return <div className="container mt-5">Book not found.</div>

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault() // Previne reîncărcarea paginii la submit

        if (newRating === 0 || newDescription.trim() === '') {
            alert('Please provide a valid rating and description.')
            return
        }
        try {
            const review: Review = {
                bookId: parseInt(id!, 10),
                userId: 1,
                rating: newRating,
                description: newDescription.trim(),
                date: new Date().toISOString().split('T')[0],
            }

            await addReview(review)
            setNewRating(0)
            setNewDescription('')
            alert('Review added successfully!')
        } catch (error) {
            console.error('Error adding review:', error)
            alert('Failed to add review. Please try again.')
        }
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br />
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={
                            book.image instanceof File
                                ? URL.createObjectURL(book.image)
                                : book.image || undefined
                        }
                        alt={book.title}
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-4">
                    <h2 className="title">{book.title}</h2>
                    <h5 className="author">{book.author}</h5>
                    <p className="description">{book.description}</p>
                </div>
                <div className="col-md-4 additional-info">
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
                        <button className="btn btn-primary me-2">
                            Add to Cart
                        </button>
                        <button className="btn btn-light">
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h3>Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews for this book yet.</p>
                ) : (
                    reviews.map((review: Review) => (
                        <React.Fragment key={review.reviewId}>
                            <ReviewCardUser review={review} />
                        </React.Fragment>
                    ))
                )}
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
