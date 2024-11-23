package com.backend.Exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class BookException extends RuntimeException {

        private final String errorMessage;

        private final int errorCode;

        public BookException(HttpStatusCode errorCode, String errorMessage) {
            super(errorMessage);
            this.errorMessage = errorMessage;
            this.errorCode = errorCode.value();
        }

        @Override
        public String toString() {
            return "BookException{" + "errorMessage='" + errorMessage + '\'' + ", errorCode=" + errorCode + '}';
        }
}
