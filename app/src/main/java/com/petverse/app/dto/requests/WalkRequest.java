package com.petverse.app.dto.requests;

import java.util.UUID;

public class WalkRequest {
    private UUID id;
    private UUID userId; // posteriormente en token
    private String walkTime;

    public WalkRequest(){}

    public WalkRequest(UUID id, UUID userId, String walkTime){
        this.id = id;
        this.userId = userId;
        this.walkTime = walkTime;
    }

    //getters y setters

    public UUID getId(){
        return id;
    }

    public UUID getUserId(){
        return userId;
    }

    public String getWalkTime(){
        return walkTime;
    }

    public void setWalkTime(String walkTime){
        this.walkTime = walkTime;
    }
}