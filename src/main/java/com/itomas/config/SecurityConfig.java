package com.itomas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.antMatcher("/**")
				.authorizeRequests().antMatchers( "/login","/public/**", "/resources/**","/resources/public/**").permitAll()
				.antMatchers("/googleLogin").anonymous().anyRequest().authenticated()
				.and()
				.formLogin()
					.loginPage("/login")
					.loginProcessingUrl("/login")
					.defaultSuccessUrl("/")
					.and()
					.csrf().disable()
					.logout()
						.logoutSuccessUrl("/")
						.logoutUrl("/logout");
	}
	

}
