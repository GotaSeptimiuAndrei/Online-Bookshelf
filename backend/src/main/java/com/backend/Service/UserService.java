package com.backend.Service;

import com.backend.Exceptions.UserException;
import com.backend.Model.User;
import com.backend.Repository.UserRepository;

import com.backend.Utils.AESCipher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;

	private final SecretKey secretKey;

	private final IvParameterSpec iv;


	public UserService(UserRepository userRepository) throws Exception {
		this.userRepository = userRepository;
		this.secretKey = AESCipher.generateSecretKey();
		this.iv = AESCipher.generateIv();
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUserById(Long id) {
		Optional<User> user = userRepository.findById(id);
		return user.orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));
	}

	public User getUserByUsername(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		return user.orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));
	}

	public User getUserByEmail(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));
	}

	public User updateUser(Long id, User updatedUser) {
		Optional<User> existingUser = userRepository.findById(id);
		if (existingUser.isPresent()) {
			User user = existingUser.get();
			user.setUsername(updatedUser.getUsername());
			user.setEmail(updatedUser.getEmail());
			user.setPassword(updatedUser.getPassword());
			return userRepository.save(user);
		}
		throw new UserException(HttpStatus.NOT_FOUND, "User not found");
	}

	public void deleteUser(Long id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
		}
		else {
			throw new UserException(HttpStatus.NOT_FOUND, "User not found");
		}
	}

}