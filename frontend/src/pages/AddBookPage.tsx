import React, { useState } from 'react'

const AddBookPage: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [description, setDescription] = useState<string>('')

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value
        if (value.length <= 800) {
            setDescription(value)
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add a New Book</h2>
            <form id="bookForm">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
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
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    ></textarea>
                    <small>{description.length} / 800 characters</small>
                </div>

                {/*<div className="mb-3">*/}
                {/*    <label htmlFor="category" className="form-label">*/}
                {/*        Category:*/}
                {/*    </label>*/}
                {/*    <select*/}
                {/*        id="category"*/}
                {/*        name="category"*/}
                {/*        className="form-select"*/}
                {/*        required*/}
                {/*    >*/}
                {/*        <option value="" disabled selected>*/}
                {/*            Select a category*/}
                {/*        </option>*/}
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
                    <label htmlFor="price" className="form-label">
                        Price:
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        step="0.1"
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
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="available_count" className="form-label">
                        Available Count:
                    </label>
                    <input
                        type="number"
                        id="available_count"
                        name="available_count"
                        className="form-control"
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
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {imagePreview && (
                    <div className="mb-3">
                        <img
                            src={imagePreview}
                            alt="Image preview"
                            style={{
                                display: 'block',
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}
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
