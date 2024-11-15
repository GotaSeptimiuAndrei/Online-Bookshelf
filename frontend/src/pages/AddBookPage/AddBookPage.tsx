import React, { useState } from 'react'
import { useBookContext } from '../../context/BooksContext'
import MyNavbar from '../../components/Navbar/Navbar'
import { useNavigate } from 'react-router-dom'

const AddBookPage: React.FC = () => {
    const { addBook } = useBookContext()
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        description: '',
        price: 0,
        rating: 0,
        availableCount: 0,
        image: null as File | null,
    })

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
                setFormData((prevData) => ({
                    ...prevData,
                    image: file,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value
        if (value.length <= 800) {
            setFormData((prevData) => ({ ...prevData, description: value }))
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
                name === 'available_count'
                    ? Number(value)
                    : value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        // Imaginea se poate trimite doar prin form data
        const formDataToSubmit = new FormData()
        formDataToSubmit.append('title', formData.title)
        formDataToSubmit.append('author', formData.author)
        formDataToSubmit.append('category', formData.category)
        formDataToSubmit.append('description', formData.description)
        formDataToSubmit.append('price', formData.price.toString())
        formDataToSubmit.append('rating', formData.rating.toString())
        formDataToSubmit.append(
            'availableCount',
            formData.availableCount.toString()
        )
        if (formData.image) {
            formDataToSubmit.append('image', formData.image)
        }

        try {
            // TODO: NU REUSESC SA REZOLV EROAREA ASTA: Argument type FormData is not assignable to parameter type FormData
            await addBook(formDataToSubmit)
            navigate('/bookshelf')
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br />
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
                        placeholder="Enter a brief description"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        required
                    ></textarea>
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
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        step="0.1"
                        // value={formData.price}
                        onChange={handleInputChange}
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
                        step="0.01"
                        min="0.01"
                        max="5.0"
                        // value={formData.rating}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="availableCount" className="form-label">
                        Available Count:
                    </label>
                    <input
                        type="number"
                        id="availableCount"
                        name="availableCount"
                        className="form-control"
                        // value={formData.availableCount}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="image_upload" className="form-label">
                        Upload Image:
                    </label>
                    <input
                        type="file"
                        id="image_upload"
                        name="image_upload"
                        className="form-control"
                        accept="image/*"
                        // TODO: VEZI AICI
                        // value={formData.image}
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {imagePreview && (
                    <div className="mb-3">
                        <img
                            src={imagePreview}
                            alt="Image preview"
                            id="image_preview"
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Add this book
                </button>
            </form>
        </div>
    )
}

export default AddBookPage
