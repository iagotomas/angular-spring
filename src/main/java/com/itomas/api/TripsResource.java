package com.itomas.api;

import java.util.List;

import org.springframework.security.oauth2.provider.OAuth2Authentication;

import com.itomas.model.Trip;

public interface TripsResource {

	public List<Trip> list(OAuth2Authentication principal);
	public boolean save(Trip trip,OAuth2Authentication principal);
}