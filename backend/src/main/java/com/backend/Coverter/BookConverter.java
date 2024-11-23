package com.backend.Coverter;

import com.backend.DTO.BookDTO;
import com.backend.Model.Book;

public class BookConverter {
    public BookConverter() {
        throw new IllegalArgumentException();
    }

    public static Book from(BookDTO bookDTO, String imageUrl) {
        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        book.setRating(bookDTO.getRating());
        book.setAvailableCount(bookDTO.getAvailableCount());
        book.setCategory(bookDTO.getCategory());

        // Handle image field conditionally
        if (imageUrl != null) {
            book.setImage(imageUrl);
        }
        return book;
    }

    public static BookDTO to(Book book) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setBookId(book.getBookId());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setDescription(book.getDescription());
        bookDTO.setPrice(book.getPrice());
        bookDTO.setRating(book.getRating());
        bookDTO.setAvailableCount(book.getAvailableCount());
        bookDTO.setCategory(book.getCategory());
        bookDTO.setImageUrl(book.getImage());
        return bookDTO;
    }

}
