package com.petverse.app.dto.requests;

import java.util.UUID;

public class SleepRequest {
    private UUID id;
    private UUID userId;
    private double sleepTime;
    private int energyPerHour;

    // Constructor
    public SleepRequest(UUID id, UUID userId, double sleepTime, int energyPerHour) {
        this.id = id;
        this.userId = userId;
        this.sleepTime = sleepTime;
        this.energyPerHour = energyPerHour;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public double getSleepTime() {
        return sleepTime;
    }

    public int getEnergyPerHour() {
        return energyPerHour;
    }

    // Setters
    public void setSleepTime(double sleepTime) {
        this.sleepTime = sleepTime;
    }

    public void setEnergyPerHour(int energyPerHour){
        this.energyPerHour = energyPerHour;
    }
}