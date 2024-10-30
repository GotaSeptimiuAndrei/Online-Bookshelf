import './App.css'
import HomePage from './pages/HomePage.tsx'
import ViewBookAdminPage from './pages/ViewBookAdminPage.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { BookProvider } from './contexts/BookProvider.tsx'
import { CategoryProvider } from './contexts/CategoryProvider.tsx'

const App: React.FC = () => {
    return (
        <Router>
            <BookProvider>
                <CategoryProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/books/:id"
                            element={<ViewBookAdminPage />}
                        />
                    </Routes>
                </CategoryProvider>
            </BookProvider>
        </Router>
    )
}

export default App
