export interface Book {
    _id?: number
    title: string
    author: string
    description: string
    price: number
    image: File | null
    rating: number
    availableCount: number
    category: string
}
