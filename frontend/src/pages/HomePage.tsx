import React from 'react'
import BestsellerBooks from '../components/Bestsellers/Bestsellers.tsx'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter.tsx'
import MyNavbar from '../components/Navbar/Navbar.tsx'

const HomePage: React.FC = () => {
    return (
        <div>
            <MyNavbar />
            <div>
                <BestsellerBooks />
                <CategoryFilter />
            </div>
        </div>
    )
}

export default HomePage
