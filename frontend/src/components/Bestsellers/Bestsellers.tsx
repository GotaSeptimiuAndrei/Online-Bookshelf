import React from 'react'
import { useBookContext } from '../../context/BooksContext.tsx'
import { Row, Col } from 'react-bootstrap'
import { Book } from '../../models/Book.ts'
import BookCard from '../Card/Card.tsx'
import './bestsellers.css'

const BestsellerBooks: React.FC = () => {
    const { books } = useBookContext()

    const bestSellers = books?.slice(0, 5) || []

    if (!books || books.length === 0) {
        return <div>Loading...</div>
    }

    console.log('Books:', books)

    console.log(bestSellers[0])

    return (
        <div>
            <h2 className="bestseller-title">Bestseller Books</h2>
            <Row xs={1} md={3} lg={5} className="g-4">
                {bestSellers.map((book: Book) => (
                    <Col key={book._id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default BestsellerBooks
