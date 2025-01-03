import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    fetchCurrentLoansService,
    fetchCurrentLoansCountService,
    isBookLoanedByUserService,
    loanBookService,
    renewLoanService,
    returnBookService,
} from '../services/loanBooksApi.ts'
import { useAuthContext } from './AuthContext.tsx'
import { CurrentLoansResponse } from '../models/CurrentLoansResponse'
import { Book } from '../models/Book'

export interface LoanBooksContext {
    currentLoans: CurrentLoansResponse[]
    fetchAndSetCurrentLoans: () => Promise<void>
    loanBook: (
        bookId: number,
        token: string,
        onError?: (error: string) => void
    ) => Promise<void>
    returnBook: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<void>
    renewLoan: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<void>
    isLoanedByUser: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<boolean>
    currentLoansCount: number
    error: string | null
}

const LoanBooksContext = createContext<LoanBooksContext | undefined>(undefined)

export const useLoanBookContext = (): LoanBooksContext => {
    const context = useContext(LoanBooksContext)
    if (!context) {
        throw new Error(
            'useLoanBookContext must be used within a LoanBookProvider'
        )
    }
    return context
}

export const LoanBookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentLoans, setCurrentLoans] = useState<CurrentLoansResponse[]>([])
    const [currentLoansCount, setCurrentLoansCount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const { token } = useAuthContext()

    useEffect(() => {
        const loadCurrentLoans = async () => {
            try {
                if (token) {
                    const loans = await fetchCurrentLoansService(token)
                    setCurrentLoans(loans)
                    const count = await fetchCurrentLoansCountService(token)
                    setCurrentLoansCount(count)
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? 'There was an error loading the current loans. Please try again later.'
                        : 'An unexpected error occurred.'
                setError(errorMessage)
            }
        }
        loadCurrentLoans()
    }, [token])

    const loanBook = async (
        bookId: number,
        token: string,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            if (token) {
                const newBookLoan: Book = await loanBookService(bookId, token)
                const newLoan: CurrentLoansResponse = {
                    bookId: newBookLoan.bookId,
                    daysLeft: 7,
                }
                setCurrentLoans((prevLoans: CurrentLoansResponse[]) => [
                    ...prevLoans,
                    newLoan,
                ])
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const isLoanedByUser = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        try {
            if (token) {
                return await isBookLoanedByUserService(token, bookId)
            }
            return false
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error checking the loan status. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
            return false
        }
    }

    const returnBook = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            if (token) {
                await returnBookService(token, bookId)
                setCurrentLoans((prevLoans) =>
                    prevLoans.filter((loan) => loan.book.bookId !== bookId)
                )
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error returning the book. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const renewLoan = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            if (token) {
                await renewLoanService(token, bookId)
                const loans = fetchCurrentLoansService(token)
                console.log('aici ', loans)
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error renewing the loan. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const fetchAndSetCurrentLoans = async () => {
        try {
            if (token) {
                const loans = await fetchCurrentLoansService(token)
                setCurrentLoans(loans)
                const count = await fetchCurrentLoansCountService(token)
                setCurrentLoansCount(count)
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error loading the current loans. Please try again later.'
                    : 'An unexpected error occurred.'
            setError(errorMessage)
            throw error
        }
    }

    return (
        <LoanBooksContext.Provider
            value={{
                currentLoans,
                fetchAndSetCurrentLoans,
                loanBook,
                returnBook,
                renewLoan,
                isLoanedByUser,
                currentLoansCount,
                error,
            }}
        >
            {children}
        </LoanBooksContext.Provider>
    )
}
