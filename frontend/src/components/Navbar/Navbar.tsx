import React from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import './navbar.css'

const MyNavbar: React.FC = () => {
    return (
        <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
            <Navbar.Brand href="#home">PageTurners</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto custom-nav">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#my-books">My Books/Shelf</Nav.Link>
                    <Nav.Link href="#my-account">My Account</Nav.Link>
                    <Nav.Link href="#cart">Cart</Nav.Link>
                </Nav>
                <Form className="d-flex">
                    <FormControl
                        type="text"
                        placeholder="Search"
                        className="mr-2"
                    />
                    <Button variant="outline-success" className="ms-2">
                        Search
                    </Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default MyNavbar
