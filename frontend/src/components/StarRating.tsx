import React from 'react'

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

        // Funcția de clic care setează ratingul
        const handleClick = () => {
            if (setNewRating) {
                setNewRating(index + 1) // Setează ratingul pe baza indexului
            }
        }

        return (
            <span
                key={index}
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: `${size}px`,
                    height: `${size}px`,
                    fontSize: `${size}px`,
                    color: '#DDDDDD', // Culoare pentru steluțele gri
                    // overflow: 'hidden',
                    cursor: setNewRating ? 'pointer' : 'default',
                }}
                onClick={handleClick}
            >
                ★
                {/* Suprapunem jumătatea colorată dacă este o steluță pe jumătate */}
                {isFullStar && (
                    <span
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            color: '#FFD700',
                            // overflow: 'hidden',
                        }}
                    >
                        ★
                    </span>
                )}
                {isHalfStar && (
                    <span
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '50%',
                            color: '#FFD700',
                            overflow: 'hidden',
                        }}
                    >
                        ★
                    </span>
                )}
            </span>
        )
    })

    return <div>{stars}</div>
}

export default StarRating
