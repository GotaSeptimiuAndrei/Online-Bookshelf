import { Book } from '../models/Book.ts'
import { Review } from '../models/Review'

export const API_BASE_URL = 'http://localhost:8080'

export const fetchBookById = async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch book')
    }

    const data: Book = await response.json()

    console.log(data)

    return data
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }

    const data: Book[] = await response.json()

    console.log('Data', data)

    return data
}

export const addBookService = async (bookData: FormData): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        body: bookData,
    })

    if (!response.ok) {
        throw new Error('Failed to create book')
    }
    // const createdBook: Book = await response.json()
    // return createdBook
    const message = await response.text()
    console.log(message)
}

export const updateBookService = async (
    id: string,
    updatedBook: FormData
): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        body: updatedBook,
    })
    if (!response.ok) {
        throw new Error('Failed to update book')
    }
    const message = await response.text()
    console.log(message)
}

export const deleteBookService = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete book')
    }
}

export const fetchReviewsByBookId = async (
    bookId: string
): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/book/${bookId}`)

    if (response.status === 204) {
        return []
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews for bookId: ${bookId}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
        console.warn(
            `Unexpected content type for bookId ${bookId}: ${contentType}`
        )
        return []
    }

    try {
        const data: Review[] = await response.json()
        console.log(`Fetched reviews for bookId ${bookId}:`, data)
        return data
    } catch (error) {
        console.error('Error parsing JSON:', error)
        throw new Error('Failed to parse JSON response')
    }
}

export const addReviewService = async (reviewData: Review): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
        throw new Error(
            `Failed to create review: ${response.status} ${response.statusText}`
        )
    }

    const data: Review = await response.json()
    console.log('Review created:', data)

    return data
}

export const deleteReviewService = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete book')
    }
}
