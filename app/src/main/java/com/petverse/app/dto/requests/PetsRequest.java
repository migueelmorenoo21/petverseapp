package com.petverse.app.dto.requests;

import java.util.UUID;

public class PetsRequest {
    private UUID userId;

    public PetsRequest(){}

    public PetsRequest(UUID userId){
        this.userId = userId;
    }

    //Getters

    public UUID getUserId(){
        return userId;
    }
}