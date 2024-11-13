export interface BackendBook {
    book_id: number
    title: string
    author: string
    description: string
    price: number
    image: File
    rating: number
    available_count: number
    category: string
}
