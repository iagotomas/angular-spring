package com.itomas.service;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.itomas.model.Traveller;

@RepositoryRestResource(path = "travellers", collectionResourceRel = "travellers")
public interface TravellerService extends
		MongoRepository<Traveller, Long> {

	List<Traveller> findByFirstName(@Param("firstName") String name);

}
