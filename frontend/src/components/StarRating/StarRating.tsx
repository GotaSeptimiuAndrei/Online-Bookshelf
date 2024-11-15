import React from 'react'
import './StarRating.css'

interface StarRatingProps {
    rating: number
    totalStars?: number
    size?: number
    setNewRating?: (rating: number) => void
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    totalStars = 5,
    size = 20,
    setNewRating,
}) => {
    const stars = Array.from({ length: totalStars }, (_, index) => {
        const isFullStar = index + 1 <= Math.floor(rating)
        const isHalfStar = !isFullStar && index < rating

        // Click handler for setting a new rating
        const handleClick = () => {
            if (setNewRating) {
                setNewRating(index + 1)
            }
        }

        return (
            <span
                key={index}
                className={`star-container ${setNewRating ? 'clickable' : ''}`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    fontSize: `${size}px`,
                }}
                onClick={handleClick}
            >
                <span className="star">★</span>
                {isFullStar && <span className="star star-full">★</span>}
                {isHalfStar && <span className="star star-half">★</span>}
            </span>
        )
    })

    return <span>{stars}</span>
}

export default StarRating
