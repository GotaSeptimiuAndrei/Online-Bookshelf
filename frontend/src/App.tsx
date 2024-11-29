import './App.css'
import AddBookPage from './pages/AddBookPage/AddBookPage.tsx'
import { Route, Routes } from 'react-router-dom'
import UpdateBookPage from './pages/UpdateBookPage/UpdateBookPage.tsx'
import BookViewPage from './pages/ViewBookPage/ViewBookPage.tsx'
import { BookProvider } from './context/BooksContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage.tsx'
import PrivateRoute from './components/PrivateRoute'
import React from 'react'
import { BookshelfPage } from './pages/BookshelfPage/BookshelfPage.tsx'
import { StartPage } from './pages/StartPage/StartPage.tsx'
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx'
import { LoginPage } from './pages/LoginPage/LoginPage.tsx'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BookProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/bookshelf" element={<BookshelfPage />} />
                    <Route path="/pageTurner" element={<StartPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/books/:id" element={<PrivateRoute />}>
                        <Route index element={<BookViewPage />} />
                    </Route>
                    <Route
                        path="/add-book"
                        element={<PrivateRoute adminOnly />}
                    >
                        <Route index element={<AddBookPage />} />
                    </Route>
                    <Route
                        path="/edit-book/:id"
                        element={<PrivateRoute adminOnly />}
                    >
                        <Route index element={<UpdateBookPage />} />
                    </Route>
                </Routes>
            </BookProvider>
        </AuthProvider>
    )
}

export default App
