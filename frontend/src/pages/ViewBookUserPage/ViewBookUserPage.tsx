import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { fetchBookById } from '../../services/booksApi.ts'
import { Book } from '../../models/Book.ts'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookUserPage.css'
import { useReviewsContext } from '../../context/ReviewsContext'
import { Review } from '../../models/Review'
import ReviewCardUser from '../../components/Review/ReviewCardUser'
import { Button, Card, Form } from 'react-bootstrap'

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { addReview } = useReviewsContext()
    const { reviews, loadReviewsByBookId } = useReviewsContext()
    const [newRating, setNewRating] = useState<number>(0)
    const [newDescription, setNewDescription] = useState<string>('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await fetchBookById(id!)
                setBook(bookData)
                await loadReviewsByBookId(id!)
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
    }, [id, loadReviewsByBookId])

    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    if (error) {
        return <div className="container mt-5">Error: {error}</div>
    }

    if (!book) {
        return <div className="container mt-5">Book not found.</div>
    }

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault() // Previne reîncărcarea paginii la submit

        if (newRating === 0 || newDescription.trim() === '') {
            alert('Please provide a valid rating and description.')
            return
        }
        try {
            const review: Review = {
                bookId: parseInt(id!, 10),
                userId: 13,
                rating: newRating,
                description: newDescription.trim(),
                date: new Date().toISOString().split('T')[0],
            }
            console.log('Review: ', review)

            await addReview(review)
            await loadReviewsByBookId(id!)
            setNewRating(0)
            setNewDescription('')
            alert('Review added successfully!')
        } catch (error) {
            console.error('Error adding review:', error)
            alert('Failed to add review. Please try again.')
        }
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
            {/* General Rating and Add Review Section */}
            <div className="mt-4 row">
                {/* General Rating Section */}
                <div className="col-md-6">
                    <h3>General Rating and Reviews</h3>
                    <p>
                        <strong>General Rating:</strong>{' '}
                        <div className="ms-2">
                            <StarRating
                                rating={generalRating}
                                totalStars={5}
                                size={30}
                            />
                        </div>
                    </p>
                    <p>
                        <strong>Number of Reviews:</strong> {reviews.length}
                    </p>
                </div>
                {/* Add Your Review Section */}
                <div className="col-md-6">
                    <Card
                        style={{
                            width: '400px',
                            height: '300px',
                            margin: '0 auto',
                        }}
                    >
                        <Card.Body>
                            <h4 className="mb-3">Add Your Review</h4>
                            <Form onSubmit={handleAddReview}>
                                <Button variant="primary" type="submit">
                                    Submit Review
                                </Button>
                                <Form.Group controlId="rating" className="mb-3">
                                    <Form.Label>Rating:</Form.Label>
                                    <StarRating
                                        rating={newRating}
                                        totalStars={5}
                                        size={30}
                                        setNewRating={setNewRating}
                                    />
                                </Form.Group>
                                <Form.Group
                                    controlId="description"
                                    className="mb-3"
                                >
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={newDescription}
                                        onChange={(e) =>
                                            setNewDescription(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* All Reviews Section */}
            <div className="mt-4">
                <h3>All Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews for this book yet.</p>
                ) : (
                    <div className="row">
                        {reviews.map((review: Review) => (
                            <div
                                key={review.reviewId}
                                className="col-md-3 mb-4"
                            >
                                <ReviewCardUser review={review} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookViewUserPage
