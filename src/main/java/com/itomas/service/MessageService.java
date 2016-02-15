package com.itomas.service;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.itomas.model.Message;
import com.itomas.model.Traveller;

@RepositoryRestResource(path = "messages", collectionResourceRel = "messages")
public interface MessageService extends MongoRepository<Message, Long>  {

	List<Message> findByTag(@Param("tag") String[] tag);

	List<Message> findByAuthor(@Param("author") Traveller author);
}
