package com.itomas.service;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.itomas.model.Trip;

@RepositoryRestResource(path="trips", collectionResourceRel="travel")
public interface TripService extends PagingAndSortingRepository<Trip,Long>  {

	List<Trip> findByTag(@Param("tag") String[] tag);
}
