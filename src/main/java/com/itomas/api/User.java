package com.itomas.api;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class User {

	public Principal user(Principal principal) {
	    return principal;
	  }
}
