import { useBookContext } from '../../context/BooksContext'
import '../../utils/reset.css'
import Card from '../../components/Card/Card'
import './BookshelfPage.css'
import MyNavbar from '../../components/Navbar/Navbar'
export function BookshelfPage() {
    const { books } = useBookContext()
    return (
        <>
            <MyNavbar />
            <div className="container mt-5">
                <h1 className="mb-4">Bookshelf</h1>
                <div className="card-grid">
                    {books.map((book) => (
                        <div className="col-md-4 mb-4" key={book._id}>
                            <Card book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}