import React from 'react'
import { Review } from '../../models/Review'
import { Button, Card } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import StarRating from '../StarRating/StarRating'
import './ReviewCardAdmin.css'

interface ReviewCardProps {
    review: Review
    onDelete: (reviewId: number) => void
}

const ReviewCardAdmin: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
    return (
        <Card className="review-card">
            <Card.Body className="review-card-body">
                <div className="review-card-user">
                    <FaUserCircle className="review-card-user-icon" />
                    <div>
                        <Card.Title className="review-card-username">
                            {'username'}
                        </Card.Title>
                        <StarRating rating={review.rating} totalStars={5} />
                    </div>
                </div>

                <Card.Text className="review-card-text">
                    {review.description}
                </Card.Text>

                <Button
                    className="review-card-button"
                    onClick={() => onDelete(review.reviewId)}
                >
                    Delete Review
                </Button>
            </Card.Body>
        </Card>
    )
}

export default ReviewCardAdmin
