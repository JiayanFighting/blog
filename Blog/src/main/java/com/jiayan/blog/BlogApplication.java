// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.jiayan.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BlogApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogApplication.class, args);
		System.out.println("*******************************");
		System.out.println("**SpringBoot Start Successful**");
		System.out.println("*******************************");
	}
}
