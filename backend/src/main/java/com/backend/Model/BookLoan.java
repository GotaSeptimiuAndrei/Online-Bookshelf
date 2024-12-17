package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "book_loans")
public class BookLoan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "loan_id")
	private Long loanId;

	@ManyToOne
	@JoinColumn(name = "book_id", nullable = false)
	private Book book;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "loan_date")
	private String loanDate;

	@Column(name = "return_date")
	private String returnDate;

	public BookLoan() {
	}

	public BookLoan(Book book, User user, String loanDate, String returnDate) {
		this.book = book;
		this.user = user;
		this.loanDate = loanDate;
		this.returnDate = returnDate;
	}

}
