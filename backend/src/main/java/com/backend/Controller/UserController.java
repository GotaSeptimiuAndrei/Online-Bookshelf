package com.backend.Controller;

import com.backend.DTO.UserDTO;
import com.backend.Model.User;
import com.backend.Service.UserService;
import com.backend.Coverter.UserConverter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
		User user = UserConverter.from(userDTO);
		User savedUser = userService.saveUser(user);
		UserDTO savedUserDTO = UserConverter.to(savedUser);
		return new ResponseEntity<>(savedUserDTO, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<UserDTO>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		List<UserDTO> userDTOs = users.stream().map(UserConverter::to).collect(Collectors.toList());
		return new ResponseEntity<>(userDTOs, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);
		UserDTO userDTO = UserConverter.to(user);
		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
		User updatedUser = UserConverter.from(userDTO);
		User savedUser = userService.updateUser(id, updatedUser);
		UserDTO savedUserDTO = UserConverter.to(savedUser);
		return new ResponseEntity<>(savedUserDTO, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/username/{username}")
	public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
		User user = userService.getUserByUsername(username);
		UserDTO userDTO = UserConverter.to(user);
		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	@GetMapping("/email/{email}")
	public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
		User user = userService.getUserByEmail(email);
		UserDTO userDTO = UserConverter.to(user);
		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

}