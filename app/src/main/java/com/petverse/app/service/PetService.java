package com.petverse.app.service;

import com.petverse.app.model.Pet;
import com.petverse.app.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PetService {

    private final PetRepository petRepository;

    private Pet getPetOrThrow(UUID petId) {
        return petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
    }

    public PetService(PetRepository petRepository){
        this.petRepository = petRepository;
    }

    public Pet feedPet(UUID petId, int foodValue, int happinessBoost, int energyBoost ){
        Pet pet = getPetOrThrow(petId);

        if(pet.getHunger() >= 100){
            throw new IllegalStateException("Tu mascota esta saciada");
        } else {
            pet.feed(foodValue,energyBoost,happinessBoost);
            return petRepository.save(pet);
        }
    }

    public Pet walkPet(UUID petId, int happinessBoost,
                       int hungerBoost, int energyDecrease, double walkTime){
        Pet pet = getPetOrThrow(petId);

        if (pet.getEnergy() <= 10){
            throw new IllegalStateException("Su mascota esta cansada, haz que duerma antes de sacarla");
        } else {
            pet.petWalk(happinessBoost, hungerBoost, energyDecrease, walkTime);
            return petRepository.save(pet);
        }
    }

    public Pet playPet( UUID petId, int energyDecrease, int happinessBoost, int hungerBoost){
        Pet pet = getPetOrThrow(petId);

        if(pet.getEnergy() <= 10){
            throw new IllegalStateException("Su mascota esta cansada, haz que duerma antes de jugar");
        } else {
            pet.play(energyDecrease, happinessBoost, hungerBoost);
            return petRepository.save(pet);
        }
    }

    public Pet sleepPet ( UUID petId, double sleepTime, int energyPerHour, int hungerBoostPerHour) {
        Pet pet = getPetOrThrow(petId);

        if(pet.getEnergy() >= 100){
            throw new IllegalStateException("Su mascota esta lo suficientemente descansada");
        } else {
            pet.sleep(sleepTime, energyPerHour, hungerBoostPerHour);
            return petRepository.save(pet);
        }
    }
}