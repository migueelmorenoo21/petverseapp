package com.petverse.app.dto.responses;

public class PlayResponse {
    private int energy;
    private int hunger;
    private int happiness;

    public PlayResponse(){}

    public PlayResponse(int happiness, int hunger, int energy){
        this.happiness = happiness;
        this.hunger = hunger;
        this.energy = energy;
    }

    //getters

    public int getHappiness(){
        return happiness;
    }

    public int getHunger(){
        return hunger;
    }

    public int getEnergy(){
        return energy;
    }

    //setters

    public void setHunger(int hunger){
        this.hunger = hunger;
    }

    public void setHappiness(int happiness){
        this.happiness = happiness;
    }

    public void setEnergy(int energy){
        this.energy = energy;
    }
}
