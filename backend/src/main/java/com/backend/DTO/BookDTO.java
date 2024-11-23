package com.backend.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BookDTO {

	private Long bookId;

	private String title;

	private String author;

	private String description;

	private Double price;

	private MultipartFile image; // For upload (POST)

	private String imageUrl; // For retrieval (GET)

	private Double rating;

	private Integer availableCount;

	private String category;

}
