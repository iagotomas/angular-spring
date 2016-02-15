package com.itomas.model;

import javax.persistence.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="trips")
public class Trip {

	private @Id Long id;
	private String name;
	private String description;
	private Integer count;
	private String[] tag;
	private Message[] messages;
	private Traveller author;
	public Trip(Long id, String name, String description, Integer count,
			String[] tag, Message[] messages, Traveller author) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.count = count;
		this.tag = tag;
		this.messages = messages;
		this.author = author;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public String[] getTag() {
		return tag;
	}
	public void setTag(String[] tag) {
		this.tag = tag;
	}
	public Message[] getMessages() {
		return messages;
	}
	public void setMessages(Message[] messages) {
		this.messages = messages;
	}
	public Traveller getAuthor() {
		return author;
	}
	public void setAuthor(Traveller author) {
		this.author = author;
	}
	public Long getId() {
		return id;
	}
	

}
