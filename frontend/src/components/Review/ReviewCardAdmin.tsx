import { Review } from '../../models/Review'
import { Button, Card } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import StarRating from '../StarRating'

interface ReviewCardProps {
    review: Review
    // onDelete: (reviewId: number) => void
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

                <Button
                    style={{
                        backgroundColor: 'gray',
                        color: '#ffffff',
                        border: 'none',
                    }} // onClick={() => onDelete(review.review_id)}
                >
                    Delete Review
                </Button>
            </Card.Body>
        </Card>
    )
}

export default ReviewCardAdmin
