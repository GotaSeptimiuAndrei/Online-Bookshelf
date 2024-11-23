package com.backend.Service;

import com.backend.Exceptions.ReviewException;
import com.backend.Model.Book;
import com.backend.Model.Review;
import com.backend.Model.User;
import com.backend.Repository.BookRepository;
import com.backend.Repository.ReviewRepository;
import com.backend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

	private final ReviewRepository reviewRepository;

	private final BookRepository bookRepository;

	private final UserRepository userRepository;

	public ReviewService(ReviewRepository reviewRepository, BookRepository bookRepository,
			UserRepository userRepository) {
		this.reviewRepository = reviewRepository;
		this.bookRepository = bookRepository;
		this.userRepository = userRepository;
	}

	public Review saveReview(Long bookId, Long userId, Review review) {

		Optional<Book> book = bookRepository.findById(bookId);
		Optional<User> user = userRepository.findById(userId);
		if (book.isPresent() && user.isPresent()) {
			review.setBook(book.get());
			review.setUser(user.get());
			return reviewRepository.save(review);
		}
		else {
			throw new ReviewException(HttpStatus.NOT_FOUND, "Book or User not found");
		}
	}

	public List<Review> getAllReviews() {
		return reviewRepository.findAll();
	}

	public List<Review> getReviewsByBookId(Long bookId) {
		return reviewRepository.findByBook_BookId(bookId);
	}

	public List<Review> getReviewsByUserId(Long userId) {
		return reviewRepository.findByUser_UserId(userId);
	}

	public Review getReviewById(Long id) {
		Optional<Review> review = reviewRepository.findById(id);
		return review.orElseThrow(() -> new ReviewException(HttpStatus.NOT_FOUND, "Review not found"));
	}

	public Review updateReview(Long id, Long bookId, Long userId, Review updatedReview) {
		Optional<Review> existingReview = reviewRepository.findById(id);
		if (existingReview.isPresent()) {
			Review review = existingReview.get();
			Optional<Book> book = bookRepository.findById(bookId);
			Optional<User> user = userRepository.findById(userId);

			if (book.isPresent() && user.isPresent()) {
				review.setBook(book.get());
				review.setUser(user.get());
				review.setDate(updatedReview.getDate());
				review.setRating(updatedReview.getRating());
				review.setDescription(updatedReview.getDescription());
				return reviewRepository.save(review);
			}
		}
		throw new ReviewException(HttpStatus.NOT_FOUND, "Review not found");
	}

	public void deleteReview(Long id) {
		if (reviewRepository.existsById(id)) {
			reviewRepository.deleteById(id);
		}
		else {
			throw new ReviewException(HttpStatus.NOT_FOUND, "Review not found");
		}

	}

}
