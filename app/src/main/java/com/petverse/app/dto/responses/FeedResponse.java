package com.petverse.app.dto.responses;

public class FeedResponse {
    private int energy;
    private int hunger;
    private int happiness;

    public FeedResponse(){
        //Constructor vacio para JPA
    }

    public FeedResponse(int energy, int hunger, int happiness){
        this.energy = energy;
        this.hunger = hunger;
        this.happiness = happiness;
    }

    //getters

    public int getEnergy(){
        return energy;
    }

    public int getHunger(){
        return hunger;
    }

    public int getHappiness(){
        return happiness;
    }

    //setters

    public void setHunger(int hunger){
        this.hunger = hunger;
    }

    public void setEnergy(int energy){
        this.energy = energy;
    }

    public void setHappiness(int happiness){
        this.happiness = happiness;
    }
}