import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { FaSearch } from 'react-icons/fa'

const MyNavbar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState(false)

    const handleSearchIconClick = () => {
        setSearchVisible(!searchVisible)
    }

    return (
        <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
            <Link to="/" className="navbar-brand">
                Page Turners
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto custom-nav">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Nav.Link href="/bookshelf">Bookshelf</Nav.Link>
                    <Nav.Link href="#my-account">My Account</Nav.Link>
                    <Nav.Link href="#cart">Cart</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <div className="search-container">
                <Form
                    className={`search-form ${searchVisible ? 'visible' : 'hidden'}`}
                >
                    <FormControl
                        type="text"
                        placeholder="Search"
                        className="mr-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // To Do: Add search logic
                            }
                        }}
                    />
                </Form>
                <FaSearch
                    className="search-icon"
                    onClick={handleSearchIconClick}
                />
            </div>
        </Navbar>
    )
}

export default MyNavbar
