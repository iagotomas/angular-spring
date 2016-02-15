package com.itomas.boot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;

import com.itomas.utils.GoogleTokenServices;

@SpringBootApplication
@EnableOAuth2Sso
public class SpringBootRestApplication {


	@Autowired
	private ResourceServerProperties sso;

	@Bean
	ResourceServerTokenServices userInfoTokenServices() {
		return new GoogleTokenServices(sso.getUserInfoUri(), sso.getClientId());
	}

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(
				SpringBootRestApplication.class);
		application.run(args);
	}
}
