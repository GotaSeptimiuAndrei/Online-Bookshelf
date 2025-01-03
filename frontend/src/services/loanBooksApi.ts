import { AxiosRequestConfig } from 'axios'
import { axiosInstance } from './authApi'
import { CurrentLoansResponse } from '../models/CurrentLoansResponse'
import { Book } from '../models/Book'

const handleAxiosResponse = (response) => {
    if (response.status !== 200) {
        throw new Error('Failed to fetch data')
    }
    return response.data
}

export const fetchCurrentLoansService = async (
    token: string
): Promise<CurrentLoansResponse[]> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axiosInstance.get(
        '/api/book-loans/current-loans',
        config
    )
    return handleAxiosResponse(response)
}

export const fetchCurrentLoansCountService = async (
    token: string
): Promise<number> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axiosInstance.get(
        '/api/book-loans/current-loans-count',
        config
    )
    return handleAxiosResponse(response)
}

export const loanBookService = async (
    bookId: number,
    token: string
): Promise<Book> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axiosInstance.put(
        `/api/book-loans/loan/${bookId}`,
        config
    )
    return handleAxiosResponse(response)
}

export const isBookLoanedByUserService = async (
    token: string,
    bookId: number
): Promise<boolean> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            bookId,
        },
    }
    const response = await axiosInstance.get(
        '/api/book-loans/is-loaned-by-user',
        config
    )
    return handleAxiosResponse(response)
}

export const returnBookService = async (
    token: string,
    bookId: number
): Promise<void> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            bookId,
        },
    }
    const response = await axiosInstance.put(
        '/api/book-loans/return',
        null,
        config
    )
    await handleAxiosResponse(response)
}

export const renewLoanService = async (
    token: string,
    bookId: number
): Promise<void> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            bookId,
        },
    }
    const response = await axiosInstance.put(
        '/api/book-loans/renew-loan',
        null,
        config
    )
    await handleAxiosResponse(response)
}
