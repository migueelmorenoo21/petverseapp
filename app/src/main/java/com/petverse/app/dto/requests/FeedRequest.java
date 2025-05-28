package com.petverse.app.dto.requests;

import java.util.UUID;

public class FeedRequest {
    private UUID id;
    private UUID userId; //posteriormente con token
    private String foodtype;


    public FeedRequest(){
        //CONSTRUCTOR VACIO PARA LA JPA
    }
    //Constructor

    public FeedRequest(UUID id, UUID userId, String foodtype){
        this.id = id;
        this.userId = userId;
        this.foodtype = foodtype;
    }

    //getters

    public UUID getId(){
        return id;
    }

    public UUID getUserId(){
        return userId;
    }

    public String getFoodtype(){
        return foodtype;
    }

    //setters

    public void setFoodtype( String foodtype ){
        this.foodtype = foodtype;
    }
}