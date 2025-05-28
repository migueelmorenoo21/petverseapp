package com.petverse.app.dto.requests;

import java.util.UUID;

public class SleepRequest {
    private UUID id;
    private UUID userId;
    private String sleepTime;

    // Constructor
    public SleepRequest(UUID id, UUID userId, String sleepTime) {
        this.id = id;
        this.userId = userId;
        this.sleepTime = sleepTime;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getSleepTime() {
        return sleepTime;
    }

    // Setters
    public void setSleepTime(String sleepTime) {
        this.sleepTime = sleepTime;
    }
}