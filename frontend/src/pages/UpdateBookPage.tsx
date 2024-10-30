import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBookById } from '../services/api.ts' // Adjust the import path as necessary
import { BookProps } from '../types/BookProps.ts'

const UpdateBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<BookProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const book = await fetchBookById(id!)
                setFormData(book)
                setLoading(false)
            } catch (error) {
                setError('Failed to fetch book')
                setLoading(false)
            }
        }
        fetchBook()
    }, [id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!formData) {
        return <div>Book not found.</div>
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Update the book data in your state or database
        console.log('Updated book:', formData)
        // Navigate back to the book view page
        navigate(`/book/${id}`) // Navigate instead of history.push
    }

    return (
        <div className="container mt-5">
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{
                            minHeight: '400px', // Adjust value as needed
                            resize: 'vertical', // Allow only vertical resize
                        }}
                    ></textarea>
                </div>
                {/*<div className="mb-3">*/}
                {/*    <label className="form-label">Category</label>*/}
                {/*    <select*/}
                {/*        className="form-control"*/}
                {/*        name="category"*/}
                {/*        value={formData.category}*/}
                {/*        onChange={handleChange}*/}
                {/*    >*/}
                {/*        <option value="">Select a Category</option>*/}
                {/*        <option value="Fiction">Fiction</option>*/}
                {/*        <option value="Non-Fiction">Non-Fiction</option>*/}
                {/*        <option value="Science">Science</option>*/}
                {/*        <option value="Biography">Biography</option>*/}
                {/*        <option value="Fantasy">Fantasy</option>*/}
                {/*        <option value="Mystery">Mystery</option>*/}
                {/*        <option value="History">History</option>*/}
                {/*        <option value="Romance">Romance</option>*/}
                {/*        <option value="Horror">Horror</option>*/}
                {/*    </select>*/}
                {/*</div>*/}

                <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <input
                        type="number"
                        className="form-control"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Available Count</label>
                    <input
                        type="number"
                        className="form-control"
                        name="availableCount"
                        value={formData.count}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="file"
                        className="form-control"
                        name="imageUrl"
                        // value={formData.imageUrl}
                        onChange={handleChange}
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
