import React, { useContext } from 'react'
import { CategoryContext } from '../../contexts/CategoryProvider.tsx'
import { Button } from 'react-bootstrap'
import './category-filter.css'

const CategoryFilter: React.FC = () => {
    const { categories, fetching, fetchingError } = useContext(CategoryContext)

    const categoryIcons: { [key: string]: string } = {
        Fiction: 'bi-book',
        'Non-Fiction': 'bi-journal',
        Science: 'bi-lightbulb',
        History: 'bi-clock-history',
        Fantasy: 'bi-magic',
    }

    if (fetching) return <div>Loading categories...</div>
    if (fetchingError) return <div>Error: {fetchingError.message}</div>

    return (
        <div>
            <h2 className="category-filter-title">Browse by Category</h2>
            <div className="d-flex justify-content-center flex-wrap">
                {categories?.map((category) => (
                    <Button
                        key={category._id}
                        variant="outline-secondary"
                        className="category-button m-3"
                    >
                        <i
                            className={`bi ${categoryIcons[category.name]} me-2`}
                        ></i>
                        {category.name}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter
