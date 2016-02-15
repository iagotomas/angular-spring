package com.itomas.model;

import java.time.OffsetDateTime;
import java.util.Arrays;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="messages")
public class Message {

	private @Id  Long id;
	private String content;
	private OffsetDateTime created;
	private Traveller author;
	private String[] tag;
	public Message(Long id, String content, OffsetDateTime created,
			Traveller author, String[] tag) {
		super();
		this.id = id;
		this.content = content;
		this.created = created;
		this.author = author;
		this.tag = tag;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public OffsetDateTime getCreated() {
		return created;
	}
	public void setCreated(OffsetDateTime created) {
		this.created = created;
	}
	public Traveller getAuthor() {
		return author;
	}
	public void setAuthor(Traveller author) {
		this.author = author;
	}
	public String[] getTag() {
		return tag;
	}
	public void setTag(String[] tag) {
		this.tag = tag;
	}
	public Long getId() {
		return id;
	}
	@Override
	public String toString() {
		return "Message [id=" + id + ", content=" + content + ", created="
				+ created + ", author=" + author + ", tag="
				+ Arrays.toString(tag) + "]";
	}
	
	
}
