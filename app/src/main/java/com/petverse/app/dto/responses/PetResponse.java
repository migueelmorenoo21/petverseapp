package com.petverse.app.dto.responses;

import java.util.Map;

public class PetResponse {

    private String userId;
    private String petId;
    private String petName;
    private Map<String, Object> properties;

    // Constructor
    public PetResponse(String petId, String userId, String petName, Map<String, Object> properties) {
        this.petId = petId;
        this.userId = userId;
        this.petName = petName;
        this.properties = properties;
    }

    // Getters
    public String getPetId() {
        return petId;
    }
    public String getUserId() {
        return userId;
    }

    public String getPetName() {
        return petName;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    // Setters
    public void setPetId(String petId) {
        this.petId = petId;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
