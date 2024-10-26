package com.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	int a;

	int b;

	public static void main(String[] args) {
		int sum=a+b; System.out.println("Sum of a and b is: "+sum);
		SpringApplication.run(BackendApplication.class, args);
	}

}
