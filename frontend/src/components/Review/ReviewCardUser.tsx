import { Review } from '../../models/Review'
import { Card } from 'react-bootstrap'
import { User } from '../../models/User'
import { Book } from '../../models/Book'
import { FaUserCircle } from 'react-icons/fa'
import StarRating from '../StarRating'

interface ReviewCardProps {
    review: Review
}

const ReviewCardAdmin: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <div className="d-flex align-items-center mb-2">
                    <FaUserCircle size={40} className="me-3" />
                    <div>
                        <Card.Title className="mb-0">{'username'}</Card.Title>
                        <StarRating rating={review.rating} totalStars={5} />
                    </div>
                </div>
                <Card.Text>{review.description}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default ReviewCardAdmin
