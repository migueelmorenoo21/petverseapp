package com.petverse.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "species", nullable = false)
    private String specie;

    @Column(nullable = false)
    private int hunger;

    @Column(nullable = false)
    private int energy;

    @Column(nullable = false)
    private int cleanliness;

    @Column(nullable = false)
    private int happiness;

    @Column(nullable = false)
    private int health;

    @Column(nullable = false)
    private LocalDateTime lastUpdate;

    // Constructors
    public Pet() {
        // Constructor vacío para JPA
    }

    public Pet(UUID userId, String name, String specie, int hunger, int energy,
               int cleanliness, int happiness, int health, LocalDateTime lastUpdate) {
        this.userId = userId;
        this.name = name;
        this.specie = specie;
        this.hunger = hunger;
        this.energy = energy;
        this.cleanliness = cleanliness;
        this.happiness = happiness;
        this.health = health;
        this.lastUpdate = lastUpdate;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getSpecie() {
        return specie;
    }

    public int getHunger() {
        return hunger;
    }

    public int getEnergy() {
        return energy;
    }

    public int getCleanliness() {
        return cleanliness;
    }

    public int getHappiness() {
        return happiness;
    }

    public int getHealth() {
        return health;
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    // Setters
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecie(String specie) {
        this.specie = specie;
    }

    public void setHunger(int hunger) {
        this.hunger = hunger;
    }

    public void setEnergy(int energy) {
        this.energy = energy;
    }

    public void setCleanliness(int cleanliness) {
        this.cleanliness = cleanliness;
    }

    public void setHappiness(int happiness) {
        this.happiness = happiness;
    }

    public void setHealth(int health) {
        this.health = health;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdate = LocalDateTime.now();
    }

    public void feed(int foodValue, int happinessBoost, int energyBoost) {
        setHappiness(Math.max(0, Math.min(100, getHappiness() + happinessBoost)));
        setHunger(Math.max(0, Math.min(100, getHunger() + foodValue)));
        setEnergy(Math.max(0, Math.min(100, getEnergy() + energyBoost)));
        setLastUpdate(LocalDateTime.now());
    }

    public void play(int energyDecrease, int happinessBoost, int hungerBoost){
        setHunger(Math.max(0, Math.min(100, getHunger() + hungerBoost)));
        setEnergy(Math.max(0, Math.min(100, getEnergy() + energyDecrease)));
        setHappiness(Math.max(0, Math.min(100, getHappiness() + happinessBoost)));
    }

    public void petWalk(int energyDecrease, int happinessBoost, int hungerBoost, double walkTime){
        setHunger(Math.max(0, Math.min(100, getHunger() + hungerBoost)));
        setEnergy(Math.max(0, Math.min(100, getEnergy() + energyDecrease)));
        setHappiness(Math.max(0, Math.min(100, getHappiness() + happinessBoost)));

        if (walkTime == 0.1) {
            happinessBoost = 5;
        } else if (walkTime == 0.2) {
            happinessBoost = 15;
        } else if (walkTime == 0.3) {
            happinessBoost = 30;
        } else if (walkTime == 0.4) {
            happinessBoost = 50;
        } else if (walkTime == 0.5) {
            happinessBoost = 60;
        } else if (walkTime == 0.6) {
            happinessBoost = 70;
        } else if (walkTime == 0.7) {
            happinessBoost = 80;
        } else if (walkTime == 0.8) {
            happinessBoost = 90;
        } else if (walkTime == 0.9) {
            happinessBoost = 95;
        } else if (walkTime == 1.0) {
            happinessBoost = 100;
        }
    }

    public void sleep ( double sleepTime, int energyPerHour, int hungerBoostPerHour ){
        setEnergy(Math.max(0, Math.min(100, getEnergy() + (int)(energyPerHour * sleepTime))));
        setHunger(Math.max(0, Math.min(100, getEnergy() + (int)(hungerBoostPerHour * sleepTime))));
    }
}
// En esta arquitectura por capas es válido que la entidad contenga métodos
// que modifican su propio estado, como feed(), play(), etc.
//
// En arquitecturas como la hexagonal (puertos y adaptadores), el modelo de dominio
// se separa del modelo de persistencia y no suele contener lógica directa.
// En ese caso, la lógica de negocio y las validaciones se trasladan a servicios
// de dominio o application services.
