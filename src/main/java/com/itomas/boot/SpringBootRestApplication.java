package com.itomas.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;

@EnableOAuth2Sso
@SpringBootApplication
public class SpringBootRestApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(
				SpringBootRestApplication.class);
		application.run(args);
	}
}
