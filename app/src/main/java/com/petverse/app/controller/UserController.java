package com.petverse.app.controller;

import com.petverse.app.dto.responses.PetResponse;
import com.petverse.app.dto.responses.PetsResponse;
import com.petverse.app.model.Pet;
import com.petverse.app.model.PetMapper;
import com.petverse.app.repository.PetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    private final PetRepository petRepository;

    public UserController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<List<PetsResponse>> getMyPets(@PathVariable UUID userId) {
        List<Pet> pets = petRepository.findAllByUserId(userId);

        if (pets.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<PetsResponse> responseList = pets.stream()
                .map(PetMapper::fromEntity)
                .toList();

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/me/{userId}/{petId}")
    public ResponseEntity<PetResponse> getPet(
            @PathVariable UUID userId,
            @PathVariable UUID petId
    ) {
        Optional<Pet> petOptional = petRepository.findByIdAndUserId(petId, userId);

        if (petOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PetResponse response = PetMapper.toSingleResponse(petOptional.get());
        return ResponseEntity.ok(response);
    }

}
