package com.covoiturage.backend.controller;

import com.covoiturage.backend.entity.Chauffeur;
import com.covoiturage.backend.repository.ChauffeurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs")
@RequiredArgsConstructor
public class ChauffeurController {

    private final ChauffeurRepository chauffeurRepository;

    @GetMapping("/top")
    public ResponseEntity<List<Chauffeur>> getTopChauffeurs() {
        return ResponseEntity.ok(chauffeurRepository.findTop5ByOrderByRatingDesc());
    }

    @GetMapping
    public ResponseEntity<List<Chauffeur>> getAllChauffeurs() {
        return ResponseEntity.ok(chauffeurRepository.findAll());
    }
}