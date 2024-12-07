import { Review } from '../models/Review'
import { API_BASE_URL, axiosInstance } from './authApi.ts'
import { AxiosResponse } from 'axios'

// export const API_BASE_URL = 'http://localhost:8080'

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
            `HTTP Error: ${response.status} ${response.statusText} - ${errorText}`
        )
    }
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
        return response.json()
    } else {
        return await response.text()
    }
}

const handleAxiosResponse = (response: AxiosResponse) => {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(
            `HTTP Error: ${response.status} ${response.statusText} - ${JSON.stringify(response.data)}`
        )
    }
    if (response.headers['content-type']?.includes('application/json')) {
        return response.data
    } else {
        return response.data
    }
}

export const addReviewService = async (reviewData: Review): Promise<Review> => {
    const response = await axiosInstance.post(`/api/reviews`, reviewData)
    return handleAxiosResponse(response)
}

export const deleteReviewService = async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/api/reviews/admin/${id}`)
    return handleAxiosResponse(response)
}

export const fetchReviewsByBookId = async (
    bookId: string
): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/book/${bookId}`)
    return handleResponse(response)
}
