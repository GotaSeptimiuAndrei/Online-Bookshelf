package com.backend.Controller;

import com.backend.Coverter.BookConverter;
import com.backend.Model.Book;
import com.backend.DTO.BookDTO;
import com.backend.Service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

	private final BookService bookService;

	public BookController(BookService bookService) {
		this.bookService = bookService;
	}

	@GetMapping
	public ResponseEntity<List<BookDTO>> getAllBooks() {
		List<Book> books = bookService.getAllBooks();
		List<BookDTO> bookDTOs = books.stream()
				.map(BookConverter::to)
				.toList();
		return ResponseEntity.ok(bookDTOs);
	}


	@GetMapping("/{id}")
	public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);

		if (book.isPresent()) {
			BookDTO bookDTO = BookConverter.to(book.get());
			return ResponseEntity.ok(bookDTO);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping
	public ResponseEntity<String> createBook(@ModelAttribute BookDTO bookDTO) {
		if (bookDTO.getTitle().isEmpty() || bookDTO.getAuthor().isEmpty() || bookDTO.getDescription().isEmpty()
				|| bookDTO.getPrice() == null || bookDTO.getImage().isEmpty() || bookDTO.getRating() == null
				|| bookDTO.getAvailableCount() == null || bookDTO.getCategory().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
		}

		String imageUrl = bookService.saveFileToAWSS3Bucket(bookDTO.getImage());

		Book book = BookConverter.from(bookDTO, imageUrl);
		bookService.saveBook(book);
		return ResponseEntity.ok("Book saved successfully");
	}


	@PutMapping("/{id}")
	public ResponseEntity<String> updateBook(@PathVariable Long id, @ModelAttribute BookDTO bookDTO) {
		Optional<Book> existingBook = bookService.getBookById(id);

		if (existingBook.isPresent()) {
			if (bookDTO.getTitle().isEmpty() || bookDTO.getAuthor().isEmpty() || bookDTO.getDescription().isEmpty()
					|| bookDTO.getPrice() == null || bookDTO.getRating() == null
					|| bookDTO.getAvailableCount() == null || bookDTO.getCategory().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
			}

			String imageUrl = existingBook.get().getImage(); // Default to existing URL
			if (bookDTO.getImage() != null && !bookDTO.getImage().isEmpty()) {
				imageUrl = bookService.saveFileToAWSS3Bucket(bookDTO.getImage());
			}

			Book updatedBook = BookConverter.from(bookDTO, imageUrl);
			updatedBook.setBookId(id);
			bookService.saveBook(updatedBook);

			return ResponseEntity.ok("Book updated successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);
		if (book.isPresent()) {
			bookService.deleteBook(id);
			return ResponseEntity.ok("Book deleted successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}

}