package com.backend.Service;

import com.backend.Model.Book;
import com.backend.Repository.BookRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

	@Value("${aws.s3.access.key}")
	private String awsS3AccessKey;

	@Value("${aws.s3.secret.key}")
	private String awsS3SecretKey;

	@Value("${aws.s3.bucket.name}")
	private String bucketName;

	private final BookRepository bookRepository;

	public BookService(BookRepository bookRepository) {
		this.bookRepository = bookRepository;
	}

	public List<Book> getAllBooks() {
		return bookRepository.findAll();
	}

	public Optional<Book> getBookById(Long id) {
		return bookRepository.findById(id);
	}

	public Book saveBook(Book book) {
		return bookRepository.save(book);
	}

	public void deleteBook(Long id) {
		bookRepository.deleteById(id);
	}

	public String saveFileToAWSS3Bucket(MultipartFile file) {
		try {
			String s3FileName = file.getOriginalFilename();

			BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecretKey);

			AmazonS3 amazonS3Client = AmazonS3ClientBuilder.standard()
				.withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
				.withRegion(Regions.EU_NORTH_1)
				.build();

			InputStream inputStream = file.getInputStream();
			ObjectMetadata objectMetadata = new ObjectMetadata();

			objectMetadata.setContentType("image/jpeg");
			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream,
					objectMetadata);
			amazonS3Client.putObject(putObjectRequest);
			return "https://" + bucketName + ".s3.amazonaws.com/" + s3FileName;
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}

}
