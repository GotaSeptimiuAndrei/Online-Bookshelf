package com.backend.Exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class UserException extends RuntimeException {

	private final String errorMessage;

	private final int errorCode;

	public UserException(HttpStatusCode errorCode, String errorMessage) {
		super(errorMessage);
		this.errorMessage = errorMessage;
		this.errorCode = errorCode.value();
	}

	@Override
	public String toString() {
		return "UserException{" + "errorMessage='" + errorMessage + '\'' + ", errorCode=" + errorCode + '}';
	}

}