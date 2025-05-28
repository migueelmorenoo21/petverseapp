package com.petverse.app.dto.requests;

import java.util.UUID;

public class PlayRequest {
    private UUID id;
    private UUID userId;
    private String game;

    public PlayRequest() {}

    public PlayRequest(UUID id, UUID userId, String game){
        this.id = id;
        this.userId = userId;
        this.game = game;
    }

    //getters y setters

    public UUID getId(){
        return id;
    }

    public UUID getUserId(){
        return userId;
    }

    public String game(){
        return game;
    }

    public void setGame(String game){
        this.game = game;
    }
}