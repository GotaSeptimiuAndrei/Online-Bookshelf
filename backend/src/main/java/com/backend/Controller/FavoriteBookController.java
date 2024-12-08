package com.backend.Controller;

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
    public ResponseEntity<String> addFavorite(@RequestParam Long userId, @RequestParam Long bookId) {
        favoriteBookService.addFavorite(userId, bookId);
        return ResponseEntity.ok("Book added to favorites");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(@RequestParam Long userId, @RequestParam Long bookId) {
        favoriteBookService.removeFavorite(userId, bookId);
        return ResponseEntity.ok("Book removed from favorites");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteBook>> getFavoritesByUser(@PathVariable Long userId) {
        List<FavoriteBook> favorites = favoriteBookService.getFavoritesByUser(userId);
        return ResponseEntity.ok(favorites);
    }
}
