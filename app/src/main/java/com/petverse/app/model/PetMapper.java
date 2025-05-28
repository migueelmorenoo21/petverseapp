package com.petverse.app.model;

import com.petverse.app.dto.responses.PetsResponse;
import com.petverse.app.dto.responses.PetResponse;

import java.util.HashMap;
import java.util.Map;

public class PetMapper {

    // Para lista de mascotas (uso en /me/{userId})
    public static PetsResponse fromEntity(Pet pet) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("especie", pet.getSpecie());
        properties.put("hunger", pet.getHunger());
        properties.put("energy", pet.getEnergy());
        properties.put("cleanliness", pet.getCleanliness());
        properties.put("happiness", pet.getHappiness());
        properties.put("health", pet.getHealth());

        return new PetsResponse(
                pet.getId().toString(),
                pet.getName(),
                properties
        );
    }

    // Para una sola mascota (uso en /me/{userId}/{petId})
    public static PetResponse toSingleResponse(Pet pet) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("especie", pet.getSpecie());
        properties.put("hunger", pet.getHunger());
        properties.put("energy", pet.getEnergy());
        properties.put("cleanliness", pet.getCleanliness());
        properties.put("happiness", pet.getHappiness());
        properties.put("health", pet.getHealth());

        return new PetResponse(
                pet.getUserId().toString(),
                pet.getId().toString(),
                pet.getName(),
                properties
        );
    }
}
