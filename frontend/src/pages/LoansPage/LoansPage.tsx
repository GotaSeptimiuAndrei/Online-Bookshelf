import { Table, Spinner, Button } from 'react-bootstrap'
import { useLoanBookContext } from '../../context/LoanBooksContext'
import MyNavbar from '../../components/Navbar/Navbar'

const BookLoanListPage: React.FC = () => {
    const {
        currentLoans,
        error,
        renewLoan,
        returnBook,
        fetchAndSetCurrentLoans,
    } = useLoanBookContext()

    const refreshLoans = async () => {
        try {
            await fetchAndSetCurrentLoans()
        } catch (err) {
            console.error('Error refreshing loans:', err)
        }
    }

    const handleRenew = async (bookId: number) => {
        try {
            await renewLoan(bookId, (err) => {
                console.log(`Failed to renew bookId ${bookId}: ${err}`)
            })
            console.log(`Successfully renewed bookId: ${bookId}`)
            await refreshLoans()
        } catch (err) {
            console.error(`Error renewing loan for bookId ${bookId}:`, err)
        }
    }

    const handleRestore = async (bookId: number) => {
        try {
            await returnBook(bookId, (err) => {
                console.log(`Failed to restore bookId ${bookId}: ${err}`)
            })
            console.log(`Successfully restored bookId: ${bookId}`)
        } catch (err) {
            console.error(`Error restoring loan for bookId ${bookId}:`, err)
        }
    }
    if (!currentLoans || currentLoans.length === 0) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="text-center mt-3">No books loan found.</p>
            </div>
        )
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <h1 className="text-center mb-4">Book Loans</h1>
            {currentLoans.length === 0 ? (
                <p className="text-center">No book loans available.</p>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Book Name</th>
                                <th>Book Author</th>
                                <th>Days Left</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLoans.map((loan, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{loan.book.title}</td>
                                    <td>{loan.book.author}</td>
                                    <td>{loan.daysLeft}</td>
                                    <td>
                                        <Button
                                            className="me-2"
                                            onClick={() =>
                                                handleRenew(loan.book.bookId)
                                            }
                                        >
                                            Renew
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleRestore(loan.book.bookId)
                                            }
                                        >
                                            Restore
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    )
}

export default BookLoanListPage
