package com.petverse.app.dto.responses;

public class WalkResponse {

    private int energy;
    private int hunger;
    private int happiness;

    public WalkResponse() {}

    public WalkResponse( int energy, int hunger, int happiness){
        this.energy = energy;
        this.hunger = hunger;
        this.happiness = happiness;
    }


    //getters y setters

    public int getEnergy(){
        return energy;
    }

    public int getHunger(){
        return hunger;
    }

    public int getHappiness(){
        return happiness;
    }

    public void setEnergy(int energy){
        this.energy = energy;
    }

    public void setHunger(int hunger){
        this.hunger = hunger;
    }

    public void setHappiness(int happiness){
        this.happiness = happiness;
    }
}