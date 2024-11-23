import React, { useState } from 'react'
import { useBookContext } from '../../context/BooksContext.tsx'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import { useNavigate } from 'react-router-dom'
import './AddBookPage.css'

const AddBookPage: React.FC = () => {
    const { addBook } = useBookContext()
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        description: '',
        price: 0,
        rating: 0,
        availableCount: 0,
        image: null as File | null,
        imageUrl: '',
    })

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.onerror = () => setError('Failed to load image preview')
            reader.readAsDataURL(file)

            setFormData((prevData) => ({ ...prevData, image: file }))
        }
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === 'price' ||
                name === 'rating' ||
                name === 'availableCount'
                    ? Number(value)
                    : value,
        }))
    }

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value
        if (value.length <= 800) {
            setFormData((prevData) => ({ ...prevData, description: value }))
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formDataToSubmit = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image' && value instanceof File) {
                formDataToSubmit.append(key, value)
            } else {
                formDataToSubmit.append(key, String(value))
            }
        })

        try {
            await addBook(formDataToSubmit)
            navigate('/bookshelf')
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Failed to fetch book')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <h2 className="mb-4">Add a New Book</h2>
            <form id="bookForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                        Author:
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        className="form-control"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        maxLength={800}
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        required
                    />
                    <small className="form-text text-muted">
                        {formData.description.length}/800 characters
                    </small>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                        Category:
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
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
                    <label htmlFor="price" className="form-label">
                        Price:
                    </label>
                    <input
                        type="text"
                        id="price"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                        Rating:
                    </label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        className="form-control"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step={0.5}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="availableCount" className="form-label">
                        Available Count:
                    </label>
                    <input
                        type="text"
                        id="availableCount"
                        name="availableCount"
                        className="form-control"
                        value={formData.availableCount}
                        onChange={handleInputChange}
                        min="0"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image:
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail mt-2"
                            style={{ maxWidth: '150px' }}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Add Book'}
                </button>
                {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                )}
            </form>
        </div>
    )
}

export default AddBookPage
