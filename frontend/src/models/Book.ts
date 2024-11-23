export interface Book {
    bookId?: string
    title: string
    author: string
    description: string
    price: number
    image: File | null
    imageUrl: string
    rating: number
    availableCount: number
    category: string
}
