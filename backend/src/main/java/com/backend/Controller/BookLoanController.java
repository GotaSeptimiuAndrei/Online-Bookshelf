package com.backend.Controller;

import com.backend.Config.ExtractJWT;
import com.backend.DTO.CurrentLoansResponse;
import com.backend.Model.Book;
import com.backend.Model.BookLoan;
import com.backend.Service.BookLoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/book-loans")
public class BookLoanController {

	private final BookLoanService bookLoanService;

	public BookLoanController(BookLoanService bookLoanService) {
		this.bookLoanService = bookLoanService;
	}

	@GetMapping("/current-loans")
	public List<CurrentLoansResponse> currentLoans(@RequestHeader("Authorization") String token) throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		return bookLoanService.currentLoans(userId);
	}

	@GetMapping("/current-loans-count")
	public int currentLoansCount(@RequestHeader("Authorization") String token) throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		return bookLoanService.currentLoansCount(userId);
	}

	@PutMapping("/loan/{bookId}")
	public Book loanBook(@RequestHeader("Authorization") String token, @PathVariable("bookId") Long bookId)
			throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		return bookLoanService.loanBook(userId, bookId);
	}

	@GetMapping("/is-loaned-by-user")
	public Boolean loanBookByUser(@RequestHeader("Authorization") String token, @RequestParam Long bookId)
			throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		return bookLoanService.loanBookByUser(userId, bookId);
	}

	@PutMapping("/return")
	public void returnBook(@RequestHeader("Authorization") String token, @RequestParam Long bookId) throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		bookLoanService.returnBook(userId, bookId);
	}

	@PutMapping("/renew-loan")
	public void renewLoan(@RequestHeader("Authorization") String token, @RequestParam Long bookId) throws Exception {
		Long userId = ExtractJWT.getUserId(token);
		bookLoanService.renewLoan(userId, bookId);
	}

}
