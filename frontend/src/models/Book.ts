export interface Book {
    bookId?: string
    title: string
    author: string
    description: string
    price: number
    image: File | null
    rating: number
    availableCount: number
    category: string
}
