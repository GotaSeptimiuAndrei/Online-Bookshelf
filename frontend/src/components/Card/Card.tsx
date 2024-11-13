import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Book } from '../../models/Book'
import './Card.css'
import '../../utils/reset.css'
import { useNavigate } from 'react-router-dom'
interface CardProps {
    book: Book
}

const Card: React.FC<CardProps> = ({ book }) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/books/${book._id}`)
    }

    return (
        <div
            onClick={handleCardClick}
            className={`card h-100 ${book.availableCount === 0 ? 'unavailable' : ''} ${book.availableCount <= 3 && book.availableCount > 0 ? 'low-stock' : ''}`}
            title="Click to see more"
        >
            <img
                src={book.image || undefined}
                className="card-img-top"
                alt={`${book.title} cover`}
            />
            <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                    <strong>Author:</strong> {book.author}
                </p>
            </div>

            <div className="card-footer">
                <small className="text-muted">
                    <p className="card-text">
                        <strong>Price:</strong> ${book.price}
                    </p>
                </small>
            </div>
        </div>
    )
}

export default Card
