package com.petverse.app.dto.requests;

import java.util.UUID;

public class PetRequest {
    private UUID userId;
    private UUID petId;

    public PetRequest(){}

    public PetRequest(UUID userId, UUID petId){
        this.userId = userId;
        this.petId = petId;
    }

    //getters

    public UUID getUserId(){
        return userId;
    }

    public UUID getPetId(){
        return petId;
    }
}