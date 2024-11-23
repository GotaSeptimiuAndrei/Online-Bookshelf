import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBookContext } from '../../context/BooksContext.tsx'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './UpdateBookPage.css'

const UpdateBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, updateBook } = useBookContext()
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const book = await getBookById(id!)
                if (!book) {
                    setError('Book not found.')
                } else {
                    setFormData((prevData) => ({
                        ...prevData,
                        title: book.title,
                        author: book.author,
                        category: book.category,
                        description: book.description,
                        price: book.price,
                        rating: book.rating,
                        availableCount: book.availableCount,
                        image: null,
                        imageUrl: book.imageUrl,
                    }))

                    setImagePreview(book.imageUrl ?? null)
                }
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
        fetchBook()
    }, [id, getBookById])

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
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData!,
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

        if (!formData) return

        const formDataToSubmit = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image' && value instanceof File) {
                formDataToSubmit.append(key, value)
            } else {
                formDataToSubmit.append(key, String(value))
            }
        })

        if (!formData.image) {
            formDataToSubmit.delete('image')
        }

        try {
            const formDataEntries = Array.from(formDataToSubmit.entries())
            formDataEntries.forEach(([key, value]) => {
                console.log(`${key}: ${value}`)
            })
            await updateBook(id!, formDataToSubmit)
            navigate(`/books/${id}`)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Failed to update book')
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!formData) {
        return <div>Book not found.</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br></br>
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
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
                    {loading ? 'Updating...' : 'Update Book'}
                </button>
                {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                )}
            </form>
        </div>
    )
}

export default UpdateBookPage
