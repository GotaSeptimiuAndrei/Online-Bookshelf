import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBookContext } from '../../context/BooksContext'
import MyNavbar from '../../components/Navbar/Navbar'
import './UpdateBookPage.css'

const UpdateBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, updateBook } = useBookContext()
    const [formData, setFormData] = useState({
        bookId: '',
        title: '',
        author: '',
        category: '',
        description: '',
        price: 0,
        rating: 0,
        availableCount: 0,
        image: null as File | null,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const book = await getBookById(id!)
                if (!book) {
                    setError('Book not found.')
                    return
                } else {
                    // setFormData(book)
                    setFormData({
                        bookId: book.bookId || '',
                        title: book.title || '',
                        author: book.author || '',
                        category: book.category || '',
                        description: book.description || '',
                        price: book.price || 0,
                        rating: book.rating || 0,
                        availableCount: book.availableCount || 0,
                        // TODO: DC NU SETAM FIISERUL INCAA??
                        // image: null, // Nu setăm fișierul încă (ASA ZICE CHAT)
                        image: book.image,
                    })

                    setLoading(false)
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Failed to fetch book')
                }
                setLoading(false)
            }
        }
        fetchBook()
    }, [id, getBookById])

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
        const { name, value, files } = e.target

        if (name === 'imageUrl' && files) {
            // Dacă este un câmp de tip `file`, setăm fișierul ca valoare
            setFormData({ ...formData, image: files[0] })
        } else {
            // Altfel, setăm valoarea direct
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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

        if (formData.image instanceof File) {
            formDataToSubmit.append('image', formData.image) // trimite fișierul ca `MultipartFile`
        }

        console.log('Updated book:', formDataToSubmit)
        // TODO: NU REUSESC SA REZOLV EROAREA ASTA: Argument type FormData is not assignable to parameter type FormData
        await updateBook(id!, formDataToSubmit)
        navigate(`/books/${id}`)
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br />
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
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-control"
                        name="category"
                        value={formData.category}
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
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Available Count</label>
                    <input
                        type="number"
                        className="form-control"
                        name="availableCount"
                        value={formData.availableCount}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="file"
                        className="form-control"
                        name="imageUrl"
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
