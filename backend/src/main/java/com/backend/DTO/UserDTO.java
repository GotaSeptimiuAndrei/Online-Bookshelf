package com.backend.DTO;

import lombok.Data;

@Data
public class UserDTO {

	private Long userId;

	private String email;

	private String password;

	private Boolean isAdmin;

	private String username;

}