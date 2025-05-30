package com.petverse.app.controller;

import com.petverse.app.dto.requests.FeedRequest;
import com.petverse.app.dto.requests.PlayRequest;
import com.petverse.app.dto.requests.SleepRequest;
import com.petverse.app.dto.requests.WalkRequest;
import com.petverse.app.dto.responses.FeedResponse;
import com.petverse.app.dto.responses.PlayResponse;
import com.petverse.app.dto.responses.SleepResponse;
import com.petverse.app.dto.responses.WalkResponse;
import com.petverse.app.model.Pet;
import com.petverse.app.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/pets/{userId}/{petId}")

public class PetController {
    private final PetService petService;

    public PetController(PetService petService){
        this.petService = petService;
    }

    @PostMapping("/feed")
    public ResponseEntity<FeedResponse> feedPet(
            @PathVariable UUID userId,
            @PathVariable UUID petId,
            @RequestBody FeedRequest request
            ) {
        Pet updated = petService.feedPet(petId, 10, 5, 3);
        return ResponseEntity.ok(new FeedResponse(
                updated.getEnergy(),
                updated.getHunger(),
                updated.getHappiness()
        ));
    }

    @PostMapping("/walk")
    public ResponseEntity<WalkResponse> walkPet(
            @PathVariable UUID userId,
            @PathVariable UUID petId,
            @RequestBody WalkRequest request
            ) {
        Pet updated = petService.walkPet(petId, 10,5,10,1);
        return ResponseEntity.ok(new WalkResponse(
                updated.getEnergy(),
                updated.getHunger(),
                updated.getHappiness()
        ));
    }

    @PostMapping("/play")
    public ResponseEntity<PlayResponse> playPet(
            @PathVariable UUID userId,
            @PathVariable UUID petId,
            @RequestBody PlayRequest request
            ) {
        Pet updated = petService.playPet(petId, 10, 5, 10);
        return ResponseEntity.ok( new PlayResponse(
                updated.getEnergy(),
                updated.getHunger(),
                updated.getHappiness()
        ));
    }

    @PostMapping("/sleep")
    public ResponseEntity<SleepResponse> sleepPet(
            @PathVariable UUID userId,
            @PathVariable UUID petId,
            @RequestBody SleepRequest request
            ){
        Pet updated = petService.sleepPet( petId, request.getSleepTime(), request.getEnergyPerHour(), 3);
        return ResponseEntity.ok( new SleepResponse(
                updated.getEnergy(),
                updated.getHunger(),
                updated.getHappiness()
        ));
    }
}