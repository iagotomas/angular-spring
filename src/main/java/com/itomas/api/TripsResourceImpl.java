package com.itomas.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itomas.model.Trip;

@Component
@RestController
@RequestMapping("trips")
public class TripsResourceImpl implements TripsResource {

    @RequestMapping(method = RequestMethod.GET)
    public List<Trip> list(OAuth2Authentication principal){
    	ArrayList<Trip> list = new ArrayList<Trip>();
    	list.add(new Trip(1L,"Trip1","description",0));
    	list.add(new Trip(2L,"Trip2","description",1));
    	return list;
    }
    @RequestMapping(method = RequestMethod.POST)
    public boolean save(@RequestParam(required=true) Trip trip,OAuth2Authentication principal){
    	return true;
    }
}
