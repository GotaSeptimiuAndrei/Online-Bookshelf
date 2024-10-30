import React, { useEffect, useReducer } from 'react'
import { fetchBooks } from '../services/api'
import { BookProps } from '../types/BookProps'
import { ActionProps } from '../types/ActionProps'

export interface BooksState {
    books?: BookProps[]
    fetching: boolean
    fetchingError?: Error | null
}

const initialState: BooksState = {
    fetching: false,
}

const reducer = (state: BooksState, action: ActionProps): BooksState => {
    switch (action.type) {
        case 'FETCH_BOOKS_STARTED':
            return { ...state, fetching: true, fetchingError: null }
        case 'FETCH_BOOKS_SUCCEEDED':
            return { ...state, books: action.payload.books, fetching: false }
        case 'FETCH_BOOKS_FAILED':
            return {
                ...state,
                fetchingError: action.payload.error,
                fetching: false,
            }
        default:
            return state
    }
}

export const BookContext = React.createContext<BooksState>(initialState)

interface BookProviderProps {
    children: React.ReactNode
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { books, fetching, fetchingError } = state

    useEffect(() => {
        fetchBooksEffect()
    }, [])

    const fetchBooksEffect = async () => {
        dispatch({ type: 'FETCH_BOOKS_STARTED' })
        try {
            const books = await fetchBooks()
            dispatch({
                type: 'FETCH_BOOKS_SUCCEEDED',
                payload: { books },
            })
        } catch (error) {
            dispatch({
                type: 'FETCH_BOOKS_FAILED',
                payload: { error: error as Error },
            })
        }
    }

    const value = {
        books,
        fetching,
        fetchingError,
    }

    return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}
