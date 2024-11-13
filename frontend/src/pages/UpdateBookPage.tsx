import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Book } from '../models/Book.ts'
import { useBookContext } from '../context/BooksContext'
import MyNavbar from '../components/Navbar/Navbar.tsx'

const UpdateBookPage: React.FC = () => {
    const { id } = useParams<{ id: number }>()
    const navigate = useNavigate()
    const { getBookById, updateBook } = useBookContext()
    const [bookData, setBookData] = useState<Book | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const book = await getBookById(id!)
                if (!book) {
                    setError('Book not found.')
                } else {
                    setBookData(book)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.message || 'Failed to fetch book')
                setLoading(false)
            }
        }
        fetchBook()
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview)
        }
    }, [id, getBookById])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!bookData) {
        return <div>Book not found.</div>
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setBookData({ ...bookData, [name]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Updated book:', bookData)
        if (bookData) {
            const formData = new FormData()
            formData.append('title', bookData.title)
            formData.append('author', bookData.author)
            formData.append('description', bookData.description)
            formData.append('category', bookData.category)
            formData.append('rating', String(bookData.rating))
            formData.append('availableCount', String(bookData.availableCount))
            if (imageFile) {
                formData.append('image', imageFile)
            } else if (bookData.image) {
                formData.append('image', bookData.image)
            }

            formData.forEach((value, key) => {
                console.log(`FormData - ${key}: ${value}`)
            })
            await updateBook(Number(id), formData)
            navigate(`/books/${id}`)
        }
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br></br>
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={bookData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        name="author"
                        value={bookData.author}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={bookData.description}
                        onChange={handleChange}
                        style={{
                            minHeight: '400px', // Adjust value as needed
                            resize: 'vertical', // Allow only vertical resize
                        }}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-control"
                        name="category"
                        value={bookData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a Category</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Science">Science</option>
                        <option value="Biography">Biography</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="History">History</option>
                        <option value="Romance">Romance</option>
                        <option value="Horror">Horror</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <input
                        type="number"
                        className="form-control"
                        name="rating"
                        value={bookData.rating}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Available Count</label>
                    <input
                        type="number"
                        className="form-control"
                        name="availableCount"
                        value={bookData.availableCount}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload New Image</label>
                    <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update Book
                </button>
            </form>
        </div>
    )
}

export default UpdateBookPage
