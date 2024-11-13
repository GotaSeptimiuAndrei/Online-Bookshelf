package com.backend.Coverter;

import com.backend.Model.User;
import com.backend.DTO.UserDTO;

public class UserConverter {

	public UserConverter() {
		throw new IllegalArgumentException();
	}

	public static User from(UserDTO userDTO) {
		User user = new User();
		user.setUserId(userDTO.getUserId());
		user.setEmail(userDTO.getEmail());
		user.setPassword(userDTO.getPassword());
		user.setIs_admin(userDTO.getIsAdmin());
		user.setUsername(userDTO.getUsername());
		return user;
	}

	public static UserDTO to(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(user.getUserId());
		userDTO.setEmail(user.getEmail());
		userDTO.setPassword(user.getPassword());
		userDTO.setIsAdmin(user.getIs_admin());
		userDTO.setUsername(user.getUsername());
		return userDTO;
	}

}