package com.backend.Service;

import com.backend.DTO.CurrentLoansResponse;
import com.backend.Model.Book;
import com.backend.Model.BookLoan;
import com.backend.Model.User;
import com.backend.Repository.BookLoanRepository;
import com.backend.Repository.BookRepository;
import com.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookLoanService {

	private final BookRepository bookRepository;

	private final BookLoanRepository bookLoanRepository;

	private final UserRepository userRepository;

	public BookLoanService(BookRepository bookRepository, BookLoanRepository bookLoanRepository,
			UserRepository userRepository) {
		this.bookRepository = bookRepository;
		this.bookLoanRepository = bookLoanRepository;
		this.userRepository = userRepository;
	}

	public Book loanBook(Long userId, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);

		BookLoan validateLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (book.isEmpty() || validateLoan != null || book.get().getAvailableCount() <= 0) {
			throw new Exception("Book does not exist or is already loaned by the user");
		}

		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new Exception("User does not exist");
		}

		Book existingBook = book.get();
		existingBook.setAvailableCount(existingBook.getAvailableCount() - 1);
		bookRepository.save(existingBook);

		BookLoan bookLoan = new BookLoan(existingBook, user.get(), LocalDate.now().toString(),
				LocalDate.now().plusDays(7).toString());

		bookLoanRepository.save(bookLoan);

		return existingBook;
	}

	public Boolean loanBookByUser(Long userId, Long bookId) {
		BookLoan validateLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);
		return validateLoan != null;
	}

	public void returnBook(Long userId, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (book.isEmpty() || bookLoan == null) {
			throw new Exception("Book does not exist or is not loaned by the user");
		}

		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new Exception("User does not exist");
		}

		Book existingBook = bookLoan.getBook();
		existingBook.setAvailableCount(existingBook.getAvailableCount() + 1);
		bookRepository.save(existingBook);

		bookLoanRepository.delete(bookLoan);
	}

	public void renewLoan(Long userId, Long bookId) throws Exception {
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (bookLoan == null) {
			throw new Exception("Book is not loaned by the user");
		}

		LocalDate returnDate = LocalDate.parse(bookLoan.getReturnDate());
		LocalDate today = LocalDate.now();

		if (!returnDate.isBefore(today)) {
			bookLoan.setReturnDate(returnDate.plusDays(7).toString());
			bookLoanRepository.save(bookLoan);
		}
		else {
			throw new Exception("Cannot renew loan. The return date has already passed.");
		}
	}

	public List<CurrentLoansResponse> currentLoans(Long userId) {
		List<CurrentLoansResponse> currentLoansResponses = new ArrayList<>();
		List<BookLoan> bookLoans = bookLoanRepository.findBookLoansByUser_UserId(userId);

		List<Long> bookIds = bookLoans.stream().map(bl -> bl.getBook().getBookId()).toList();

		List<Book> books = bookRepository.findAllById(bookIds);

		LocalDate today = LocalDate.now();

		for (Book book : books) {
			Optional<BookLoan> bookLoan = bookLoans.stream()
				.filter(b -> b.getBook().getBookId().equals(book.getBookId()))
				.findFirst();

			if (bookLoan.isPresent()) {
				LocalDate returnDate = LocalDate.parse(bookLoan.get().getReturnDate());
				long daysLeft = ChronoUnit.DAYS.between(today, returnDate);

				if (!returnDate.isBefore(today)) {
					currentLoansResponses.add(new CurrentLoansResponse(book, Math.toIntExact(daysLeft)));
				}
			}
		}

		return currentLoansResponses;
	}

	public int currentLoansCount(Long userId) {
		return bookLoanRepository.findBookLoansByUser_UserId(userId).size();
	}

}
