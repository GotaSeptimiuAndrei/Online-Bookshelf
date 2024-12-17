package com.backend.DTO;

import com.backend.Model.Book;
import lombok.Data;

@Data
public class CurrentLoansResponse {

	public Book book;

	private Integer daysLeft;

	public CurrentLoansResponse(Book book, Integer daysLeft) {
		this.book = book;
		this.daysLeft = daysLeft;
	}

}
