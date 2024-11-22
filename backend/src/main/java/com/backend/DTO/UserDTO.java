package com.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

	private Long userId;

	private String email;

	private String password;

	private Boolean isAdmin;

	private String username;

}