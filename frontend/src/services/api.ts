import { Book } from '../models/Book.ts'
import { BackendBook } from '../models/BackendBook.ts'
import { Review } from '../models/Review'

export const API_BASE_URL = 'http://localhost:8080'

export const fetchBookById = async (id: number): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch book')
    }

    const data: BackendBook = await response.json()

    console.log(data)

    return {
        _id: data.book_id,
        title: data.title,
        author: data.author,
        description: data.description,
        price: data.price,
        image: data.image,
        rating: data.rating,
        availableCount: data.available_count,
        category: data.category,
    }
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }

    const data: BackendBook[] = await response.json()

    console.log('Data', data)

    return data.map((book) => ({
        _id: book.book_id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        image: book.image,
        rating: book.rating,
        availableCount: book.available_count,
        category: book.category,
    }))
}

export const createBook = async (bookData: FormData): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        body: bookData,
    })

    if (!response.ok) {
        throw new Error('Failed to create book')
    }

    const message = await response.text()
    console.log(message)
}

export const updateBookService = async (
    id: number,
    updatedBook: FormData
): Promise<Book> => {
    // console.log('API')
    // updatedBook.forEach((value, key) => {
    //     console.log(`FormData - ${key}:`, value)
    // })
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        body: updatedBook,
    })

    if (!response.ok) {
        // const errorText = await response.text()
        // throw new Error(`Failed to update book: ${errorText}`)
        throw new Error(`Failed to update book`)
    }
    const message = await response.text()
    console.log(message)
}

export const deleteBookService = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete book')
    }
}

// export const deleteReviewService = async (id: number): Promise<void> => {
//     const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
//         method: 'DELETE',
//     })
//     if (!response.ok) {
//         throw new Error('Failed to delete review')
//     }
// }

// export const fetchReviewsByBookIdService = async (
//     book_id: number
// ): Promise<Review[]> => {
//     const response = await fetch(`${API_BASE_URL}/api/reviews/${book_id}`)
//     if (!response.ok) {
//         throw new Error('Failed to fetch reviews')
//     }
//
//     const data: Review[] = await response.json()
//
//     console.log(data)
//
//     return data
// }
