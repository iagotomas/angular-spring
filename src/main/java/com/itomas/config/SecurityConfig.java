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
		http
	      .antMatcher("/**")
	      .authorizeRequests()
	        .antMatchers("/","/js/**","/css/**","/node_modules/**","/partials/**","/favicon.ico**","/index.html**", "/login**", "/webjars/**")
	        .permitAll()
	      .anyRequest()
	        .authenticated();
	}


}
