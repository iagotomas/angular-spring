package com.itomas.model;

public class Trip {

	private long id;
	private String name;
	private String description;
	private int count;

	public Trip() {
		// NOOP
	}
	
	public Trip(long id, String name, String description, int count) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.count = count;
	}

	public long getId() {
		return id;
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
