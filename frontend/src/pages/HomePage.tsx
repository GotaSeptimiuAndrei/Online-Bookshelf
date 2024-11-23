import React from 'react'
import BestsellerBooks from '../components/Bestsellers/Bestsellers.tsx'
import MyNavbar from '../components/Navbar/Navbar.tsx'

const HomePage: React.FC = () => {
    return (
        <div>
            <MyNavbar />
            <div>
                <BestsellerBooks />
            </div>
        </div>
    )
}

export default HomePage
