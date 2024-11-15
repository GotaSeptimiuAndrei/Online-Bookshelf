import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
} from 'react'
import { Review } from '../models/Review'
import {
    addReviewService,
    deleteBookService,
    deleteReviewService,
    fetchReviewsByBookId,
} from '../services/api'

export interface ReviewsContextProps {
    reviews: Review[]
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>
    loadReviewsByBookId: (bookId: string) => Promise<void>
    addReview: (review: Review) => Promise<Review>
    deleteReview: (id: number) => Promise<void>
}

const initialReviews: Review[] = []

const ReviewsContext = createContext<ReviewsContextProps>({
    reviews: initialReviews,
    setReviews: () => {},
    loadReviewsByBookId: async () => {},
    addReview: async (): Promise<Review> => {},
    deleteReview: async () => {},
})

export const useReviewsContext = () => useContext(ReviewsContext)

export const ReviewsProvider: React.FC<{
    children: ReactNode
    bookId?: string
}> = ({ children, bookId }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const loadReviewsByBookId = async (bookId: string) => {
        try {
            const bookReviews = await fetchReviewsByBookId(bookId)
            setReviews(bookReviews)
        } catch (error) {
            console.error(`Error loading reviews for book ${bookId}:`, error)
            setReviews([])
        }
    }
    useEffect(() => {
        if (bookId) {
            loadReviewsByBookId(bookId)
        }
    }, [bookId]) // Rulează efectul doar când `bookId` se schimbă

    const addReview = async (review: Review): Promise<Review> => {
        try {
            const newReview = await addReviewService(review)
            setReviews((previewReviews) => [...previewReviews, newReview])
            return newReview
        } catch (error) {
            console.error('Error adding review:', error)
        }
    }

    const deleteReview = async (id: number) => {
        try {
            await deleteReviewService(id)
            setReviews((previewReviews) =>
                previewReviews.filter((r) => r.reviewId !== id)
            )
        } catch (error) {
            console.error('Error deleting book:', error)
        }
    }

    return (
        <ReviewsContext.Provider
            value={{
                reviews,
                setReviews,
                loadReviewsByBookId,
                addReview,
                deleteReview,
            }}
        >
            {children}
        </ReviewsContext.Provider>
    )
}
