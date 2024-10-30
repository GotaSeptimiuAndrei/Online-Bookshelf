import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { BookProps } from '../../types/BookProps.ts'
import './book-card.css'
import { useNavigate } from 'react-router-dom'

interface BookCardProps {
    book: BookProps
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/books/${book._id}`)
    }

    return (
        <Card onClick={handleCardClick} className="book-card">
            <div className="card-image-container">
                <Card.Img
                    variant="top"
                    src={book.coverImage}
                    className="card-image"
                />
                <Button className="favorite-button">
                    <i className="bi bi-heart"></i>
                </Button>
                <Button className="cart-button">
                    <i className="bi bi-cart"></i>
                </Button>
            </div>
            <Card.Body>
                <div className="card-body-content">
                    <Card.Title className="card-title">{book.title}</Card.Title>
                    <Card.Text className="card-author">{book.author}</Card.Text>
                </div>
            </Card.Body>
        </Card>
    )
}

export default BookCard
