package com.itomas.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Trip {

	private @Id @GeneratedValue(strategy = GenerationType.AUTO) long id;
	private String name;
	private String description;
	private int count;
	private String[] tag;



	public String[] getTag() {
		return tag;
	}

	public void setTag(String[] tag) {
		this.tag = tag;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setCount(int count) {
		this.count = count;
	}


	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public int getCount() {
		return count;
	}

}
