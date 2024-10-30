import React from 'react'

// Definirea proprietăților pentru componenta StarRating
interface StarRatingProps {
    rating: number // Rating-ul ca un număr
    totalStars?: number // Numărul total de stele (opțional, implicit 5)
}

// Componenta StarRating
const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
    const fullStars = Math.floor(rating) // Numărul de stele pline
    const hasHalfStar = rating % 1 !== 0 // Verificăm dacă există o stea jumătate

    return (
        <div>
            {[...Array(totalStars)].map((_, index) => {
                if (index < fullStars) {
                    return (
                        <span key={index} className="text-warning">
                            ★
                        </span>
                    ) // Stea plină
                } else if (index === fullStars && hasHalfStar) {
                    return (
                        <span key={index} className="text-warning">
                            ☆
                        </span>
                    ) // Stea jumătate (colorată)
                } else {
                    return (
                        <span key={index} className="text-muted">
                            ☆
                        </span>
                    ) // Stea goală (contur)
                }
            })}
        </div>
    )
}
export default StarRating
