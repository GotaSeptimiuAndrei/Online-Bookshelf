import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    createBook,
    deleteBookService,
    fetchBookById,
    fetchBooks,
    // fetchReviewsByBookIdService,
    updateBookService,
} from '../services/api'
import { Book } from '../models/Book'
import { Review } from '../models/Review'

export interface BooksContext {
    books: Book[]
    addBook: (book: FormData) => Promise<void>
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    getBookById: (id: number) => Promise<Book | undefined>
    deleteBook: (id: number) => Promise<void>
    updateBook: (id: number, bookData: FormData) => Promise<void>
    getReviewsByBookId: (id: number) => Promise<Review[]>
}

const localReviews: Review[] = [
    {
        review_id: 1,
        // user_id: 1,
        book_id: 11,
        rating: 5,
        description: 'Great book!',
    },
    {
        review_id: 2,
        // user_id: 1,
        book_id: 9,
        rating: 4,
        description: 'Enjoyed reading this.',
    },
    {
        review_id: 3,
        // user_id: 1,
        book_id: 9,
        rating: 3,
        description: 'It was okay.',
    },
    {
        review_id: 4,
        // user_id: 1,
        book_id: 11,
        rating: 4,
        description: 'It was okay.',
    },
]

const initialBooks: Book[] = []
const BooksContext = createContext<BooksContext>({
    books: initialBooks,
    addBook: async (book: FormData): Promise<void> => {},
    updateBook: async () => {},
    deleteBook: async () => {},
    setBooks: () => {},
    getBookById: async () => undefined,
    getReviewsByBookId: async () => [],
})

export const useBookContext = () => useContext(BooksContext)

export const BookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [books, setBooks] = useState<Book[]>(initialBooks)
    const [reviews, setReviews] = useState<Review[]>([])

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

    const addBook = async (bookData: FormData): Promise<void> => {
        try {
            const createdBook = await createBook(bookData)
            setBooks((prevBooks) => [...prevBooks, createdBook])
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    const updateBook = async (
        id: number,
        bookData: FormData
    ): Promise<void> => {
        try {
            const updatedBook = await updateBookService(id, bookData)
            setBooks((prevBooks) =>
                prevBooks.map((b) => (b._id === id ? updatedBook : b))
            )
        } catch (error) {
            console.error('Error updating book:', error)
        }
    }
    const deleteBook = async (id: number) => {
        try {
            await deleteBookService(id)
            setBooks((prevBooks) => prevBooks.filter((b) => b._id !== id))
        } catch (error) {
            console.error('Error deleting book:', error)
        }
    }

    // const deleteReview = async (id: number) => {
    //     try {
    //         await deleteReviewService(id)
    //         setReviews((prevReviews) =>
    //             prevReviews.filter((r) => r.review_id !== id)
    //         )
    //     } catch (error) {
    //         console.error('Error deleting review:', error)
    //     }
    // }

    // const getBookById = async (id: number): Promise<Book | undefined> => {
    //     try {
    //         console.log('Context ID ' + id)
    //         const book = await fetchBookById(id)
    //         return book
    //     } catch (error) {
    //         console.error('Error fetching book by ID:', error)
    //         return undefined
    //     }
    // }

    // In BooksContext.tsx
    const getBookById = useCallback(async (id: number) => {
        return await fetchBookById(id)
    }, [])

    // const getReviewsByBookId = async (id: number): Promise<Review[]> => {
    //     try {
    //         //     const reviewsData = await fetchReviewsByBookIdService(bookId)
    //         console.log('ID CONTEXT: ', id, 'Type of ID:', typeof id)
    //         const reviewsData = localReviews.filter(
    //             (review) => review.book_id === id
    //         )
    //         setReviews(reviewsData)
    //         return reviewsData
    //     } catch (error) {
    //         console.error('Error fetching reviews by book ID:', error)
    //         return []
    //     }
    // }

    const getReviewsByBookId = useCallback(
        async (id: number): Promise<Review[]> => {
            try {
                console.log('ID CONTEXT: ', id, 'Type of ID:', typeof id)
                const reviewsData = localReviews.filter(
                    (review) => review.book_id === id
                )
                setReviews(reviewsData)
                return reviewsData
            } catch (error) {
                console.error('Error fetching reviews by book ID:', error)
                return []
            }
        },
        [localReviews, setReviews]
    )

    return (
        <BooksContext.Provider
            value={{
                books,
                addBook,
                updateBook,
                deleteBook,
                getBookById,
                setBooks,
                getReviewsByBookId,
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}
