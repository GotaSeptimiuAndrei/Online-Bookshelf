import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Book } from '../models/Book'
import {
    addBookService,
    deleteBookService,
    fetchBookById,
    fetchBooks,
    updateBookService,
} from '../services/api'

export interface BooksContext {
    books: Book[]
    addBook: (bookData: FormData) => Promise<Book>
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    getBookById: (id: string) => Promise<Book | undefined>
    deleteBook: (id: string) => Promise<void>
    updateBook: (id: string, bookData: FormData) => Promise<Book>
}

const initialBooks: Book[] = []
const BooksContext = createContext<BooksContext>({
    books: initialBooks,
    addBook: async (): Promise<Book> => {},
    updateBook: async (): Promise<Book> => {},
    deleteBook: async () => {},
    setBooks: () => {},
    getBookById: async () => undefined,
})

export const useBookContext = () => useContext(BooksContext)

export const BookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [books, setBooks] = useState<Book[]>(initialBooks)

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const fetchedBooks = await fetchBooks()
                setBooks(fetchedBooks)
            } catch (error) {
                console.error('Error loading books:', error)
            }
        }
        loadBooks()
    }, [])

    const addBook = async (bookData: FormData): Promise<Book> => {
        try {
            const newBook = await addBookService(bookData)
            const updatedBooks = await fetchBooks()
            setBooks(updatedBooks)
            return newBook
        } catch (error) {
            console.error('Error adding book:', error)
            throw error
        }
    }

    const updateBook = async (
        id: string,
        bookData: FormData
    ): Promise<Book> => {
        try {
            const updatedBook = await updateBookService(id, bookData)
            setBooks((prevBooks) =>
                prevBooks.map((b) => (b.bookId === id ? updatedBook : b))
            )
        } catch (error) {
            console.error('Error updating book:', error)
        }
    }

    const deleteBook = async (id: string) => {
        try {
            await deleteBookService(id)
            const updatedBooks = await fetchBooks()
            setBooks(updatedBooks)
        } catch (error) {
            console.error('Error deleting book:', error)
        }
    }

    const getBookById = async (id: string): Promise<Book | undefined> => {
        try {
            const book = await fetchBookById(id)
            return book
        } catch (error) {
            console.error('Error fetching book by ID:', error)
            return undefined
        }
    }

    return (
        <BooksContext.Provider
            value={{
                books,
                addBook,
                updateBook,
                deleteBook,
                getBookById,
                setBooks,
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}
