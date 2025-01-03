import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { fetchBookById } from '../../services/booksApi.ts'
import { Book } from '../../models/Book.ts'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookUserPage.css'
import { useReviewsContext } from '../../context/ReviewsContext'
import { Review } from '../../models/Review'
import ReviewCardUser from '../../components/Review/ReviewCardUser'
import { Button, Card, Form } from 'react-bootstrap'
import { useAuthContext } from '../../context/AuthContext'
import { useFavoriteBookContext } from '../../context/FavoriteBooksContext.tsx'
import { useLoanBookContext } from '../../context/LoanBooksContext'

const BookViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { addReview } = useReviewsContext()
    const { reviews, loadReviewsByBookId } = useReviewsContext()
    const { addFavoriteBook, removeFavoriteBook, isFavorite } =
        useFavoriteBookContext()
    const [newRating, setNewRating] = useState<number>(0)
    const [newDescription, setNewDescription] = useState<string>('')
    const [isFavoriteBook, setIsFavoriteBook] = useState<boolean>(false)
    const [isLoaned, setIsLoaned] = useState<boolean>(false)
    const { user, token } = useAuthContext()
    const { loanBook, isLoanedByUser } = useLoanBookContext()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await fetchBookById(id!)
                if (!bookData) {
                    setError('Book not found!')
                } else {
                    setBook(bookData)
                }

                await loadReviewsByBookId(id!)

                const favorite = await isFavorite(Number(id!))
                setIsFavoriteBook(favorite)

                const loaned = await isLoanedByUser(Number(id!))
                setIsLoaned(loaned)
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
    }, [id, loadReviewsByBookId, isFavorite, isLoanedByUser])

    const handleFavoriteClick = async () => {
        if (isFavoriteBook) {
            try {
                await removeFavoriteBook(Number(id!))
                setIsFavoriteBook(false)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Failed to remove the book from favorites')
                }
            }
        } else {
            try {
                await addFavoriteBook(Number(id!))
                setIsFavoriteBook(true)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Failed to add the book to favorites')
                }
            }
        }
    }

    const handleLoanBook = async () => {
        try {
            if (book!.availableCount <= 0) {
                alert('This book is currently unavailable.')
                return
            }
            console.log('token ', token)
            await loanBook(Number(id!), token)
            setBook((prevBook) =>
                prevBook
                    ? {
                          ...prevBook,
                          availableCount: prevBook.availableCount - 1,
                      }
                    : prevBook
            )
            setIsLoaned(true)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Failed to loan the book.')
            }
        }
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    if (error) {
        return <div className="loading">Error: {error}</div>
    }

    if (!book) {
        return <div className="loading">Book not found.</div>
    }

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newRating === 0 || newDescription.trim() === '') {
            alert('Please provide a valid rating and description.')
            return
        }
        try {
            const review: Review = {
                bookId: parseInt(id!, 10),
                userId: user?.userId as number,
                username: user?.username as string,
                rating: newRating,
                description: newDescription.trim(),
                date: new Date().toISOString().split('T')[0],
            }
            console.log('Review: ', review)

            await addReview(review)
            await loadReviewsByBookId(id!)
            setNewRating(0)
            setNewDescription('')
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
                        <strong>Available Count:</strong> {book.availableCount}
                    </p>
                    <div className="d-flex mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleLoanBook}
                            disabled={isLoaned}
                        >
                            {isLoaned ? 'You already loan this book' : 'Loan'}
                        </button>
                        <button
                            className="btn btn-light"
                            onClick={handleFavoriteClick}
                        >
                            <FontAwesomeIcon
                                icon={
                                    isFavoriteBook
                                        ? faHeartSolid
                                        : faHeartRegular
                                }
                            />
                        </button>
                    </div>
                </div>
            </div>
            {/* General Rating and Add Review Section */}
            <div className="mt-4 row">
                {/* General Rating Section */}
                <div className="col-md-6">
                    <h3>General Rating and Reviews</h3>
                    <div>
                        <strong>General Rating:</strong>{' '}
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
