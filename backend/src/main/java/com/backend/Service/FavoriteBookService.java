package com.backend.Service;

import com.backend.Model.Book;
import com.backend.Model.FavoriteBook;
import com.backend.Model.User;
import com.backend.Repository.BookRepository;
import com.backend.Repository.FavoriteBookRepository;
import com.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteBookService {

    private final FavoriteBookRepository favoriteBookRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    public FavoriteBookService(FavoriteBookRepository favoriteBookRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.favoriteBookRepository = favoriteBookRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public void addFavorite(Long userId, Long bookId) {
        if (favoriteBookRepository.existsByUser_UserIdAndBook_BookId(userId, bookId)) {
            throw new IllegalStateException("Book is already a favorite.");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new IllegalArgumentException("Book not found"));

        FavoriteBook favoriteBook = new FavoriteBook();
        favoriteBook.setUser(user);
        favoriteBook.setBook(book);

        favoriteBookRepository.save(favoriteBook);
    }

    public void removeFavorite(Long userId, Long bookId) {
        if (!favoriteBookRepository.existsByUser_UserIdAndBook_BookId(userId, bookId)) {
            throw new IllegalStateException("Book is not a favorite.");
        }

        favoriteBookRepository.deleteByUser_UserIdAndBook_BookId(userId, bookId);
    }

    public List<FavoriteBook> getFavoritesByUser(Long userId) {
        return favoriteBookRepository.findByUser_UserId(userId);
    }
}
