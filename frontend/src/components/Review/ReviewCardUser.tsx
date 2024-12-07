import React from 'react'
import { Review } from '../../models/Review'
import { Card } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import StarRating from '../StarRating/StarRating'
import './ReviewCardUser.css'

interface ReviewCardProps {
    review: Review
}

const ReviewCardUser: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <Card className="review-card">
            <Card.Body className="review-card-body">
                <div className="review-card-user">
                    <FaUserCircle className="review-card-user-icon" />
                    <div>
                        <Card.Title className="review-card-username">
                            {'username'}
                        </Card.Title>
                        <div className="review-card-rating">
                            <StarRating rating={review.rating} totalStars={5} />
                        </div>
                    </div>
                </div>
                <Card.Text className="review-card-text">
                    {review.description}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default ReviewCardUser
