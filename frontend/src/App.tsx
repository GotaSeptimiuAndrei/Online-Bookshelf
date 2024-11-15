import './App.css'
import AddBookPage from './pages/AddBookPage/AddBookPage.tsx'
import { Route, Routes } from 'react-router-dom'
import UpdateBookPage from './pages/UpdateBookPage/UpdateBookPage.tsx'
import { BookProvider } from './context/BooksContext'
import HomePage from './pages/HomePage.tsx'
import React from 'react'
import { BookshelfPage } from './pages/BookshelfPage/BookshelfPage.tsx'
import { ReviewsProvider } from './context/ReviewsContext'
import BookViewUserPage from './pages/ViewBookUserPage/ViewBookUserPage'

const App: React.FC = () => {
    return (
        <BookProvider>
            <ReviewsProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add-book" element={<AddBookPage />} />
                    <Route path="/books/:id" element={<BookViewUserPage />} />
                    <Route path="/edit-book/:id" element={<UpdateBookPage />} />
                    <Route path="/bookshelf" element={<BookshelfPage />} />
                </Routes>
            </ReviewsProvider>
        </BookProvider>
    )
}

export default App
