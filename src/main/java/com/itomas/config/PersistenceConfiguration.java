package com.itomas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;

@Configuration
@EnableMongoRepositories
public class PersistenceConfiguration extends AbstractMongoConfiguration{
	@Value("spring.data.mongodb.database")
	private String database;
	@Value("spring.data.mongodb.host")
	private String host;
	@Value("spring.data.mongodb.port")
	private String port;
	@Override
	protected String getDatabaseName() {
		return database;
	}

	@Override
	public Mongo mongo() throws Exception {
		// TODO Auto-generated method stub
		return new MongoClient(host+":"+port);
	}

}
