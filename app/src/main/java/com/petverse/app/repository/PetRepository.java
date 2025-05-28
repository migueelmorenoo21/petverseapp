package com.petverse.app.repository;

import com.petverse.app.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PetRepository extends JpaRepository<Pet, UUID> {
    List<Pet> findAllByUserId(UUID userId);
    Optional<Pet> findByIdAndUserId(UUID id, UUID userId);

}
