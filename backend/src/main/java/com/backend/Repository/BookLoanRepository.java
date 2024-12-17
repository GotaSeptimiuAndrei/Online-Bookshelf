package com.backend.Repository;

import com.backend.Model.BookLoan;
import com.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BookLoanRepository extends JpaRepository<BookLoan, Long> {

	BookLoan findByUser_UserIdAndBook_BookId(Long userId, Long bookId);

	List<BookLoan> findBookLoansByUser_UserId(Long userId);

	@Modifying
	@Transactional
	@Query("delete from BookLoan b where b.book.bookId = :bookId")
	void deleteAllByBookId(@Param("bookId") Long bookId);

}
