package com.itomas.api;

import org.springframework.security.oauth2.provider.OAuth2Authentication;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.itomas.oauth2.google.security.model.GoogleProfile;

public interface UserResource {

	public abstract GoogleProfile retrieveProfile(OAuth2Authentication principal)
			throws JsonProcessingException;

}