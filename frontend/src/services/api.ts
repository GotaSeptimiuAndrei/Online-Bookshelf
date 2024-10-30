import { BookProps } from '../types/BookProps.ts'
import { CategoryProps } from '../types/CategoryProps.ts'

export const API_BASE_URL = 'http://localhost:3000'

export const fetchBooks = async (): Promise<BookProps[]> => {
    const response = await fetch(`${API_BASE_URL}/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }
    return response.json()
}

export const fetchBookById = async (id: string): Promise<BookProps> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch book')
    }
    return response.json()
}

export const fetchCategories = async (): Promise<CategoryProps[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) {
        throw new Error('Failed to fetch categories')
    }
    return response.json()
}
