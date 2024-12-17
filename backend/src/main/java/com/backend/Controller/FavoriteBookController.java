package com.backend.Controller;

import com.backend.DTO.FavoriteBookDTO;
import com.backend.Model.FavoriteBook;
import com.backend.Service.FavoriteBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/favorite_books")
public class FavoriteBookController {

	private final FavoriteBookService favoriteBookService;

	public FavoriteBookController(FavoriteBookService favoriteBookService) {
		this.favoriteBookService = favoriteBookService;
	}

	@PostMapping("/add")
	public ResponseEntity<String> addFavorite(@RequestBody FavoriteBookDTO request) {
		if (request.getUserId() == null) {
			throw new IllegalArgumentException("userId is required.");
		}
		if (request.getBookId() == null) {
			throw new IllegalArgumentException("bookId is required.");
		}
		favoriteBookService.addFavorite(request.getUserId(), request.getBookId());
		return ResponseEntity.ok("Book added to favorites");
	}

	@PostMapping("/remove")
	public ResponseEntity<String> removeFavorite(@RequestBody FavoriteBookDTO request) {
		if (request.getUserId() == null) {
			throw new IllegalArgumentException("userId is required.");
		}
		if (request.getBookId() == null) {
			throw new IllegalArgumentException("bookId is required.");
		}
		favoriteBookService.removeFavorite(request.getUserId(), request.getBookId());
		return ResponseEntity.ok("Book removed from favorites");
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<FavoriteBook>> getFavoritesByUser(@PathVariable Long userId) {
		List<FavoriteBook> favorites = favoriteBookService.getFavoritesByUser(userId);
		return ResponseEntity.ok(favorites);
	}

}
