package com.backend.Repository;

import com.backend.Model.FavoriteBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteBookRepository extends JpaRepository<FavoriteBook, Long> {
    List<FavoriteBook> findByUser_UserId(Long userId);

    boolean existsByUser_UserIdAndBook_BookId(Long userId, Long bookId);

    void deleteByUser_UserIdAndBook_BookId(Long userId, Long bookId);
}
