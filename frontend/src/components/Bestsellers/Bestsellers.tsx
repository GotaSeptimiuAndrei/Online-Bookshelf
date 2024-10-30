import React, { useContext } from 'react'
import { BookContext } from '../../contexts/BookProvider.tsx'
import { Row, Col } from 'react-bootstrap'
import { BookProps } from '../../types/BookProps.ts'
import BookCard from '../BookCard/BookCard.tsx'
import './bestsellers.css'

const BestsellerBooks: React.FC = () => {
    const { books, fetching, fetchingError } = useContext(BookContext)

    if (fetching) return <div>Loading...</div>
    if (fetchingError) return <div>Error: {fetchingError.message}</div>

    const bestSellers = books?.slice(0, 5) || []

    return (
        <div>
            <h2 className="bestseller-title">Bestseller Books</h2>
            <Row xs={1} md={3} lg={5} className="g-4">
                {bestSellers.map((book: BookProps) => (
                    <Col key={book._id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default BestsellerBooks
