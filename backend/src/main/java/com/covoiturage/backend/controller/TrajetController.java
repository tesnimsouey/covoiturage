package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.TrajetRequest;
import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.service.TrajetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trajets")
@RequiredArgsConstructor
public class TrajetController {

    private final TrajetService trajetService;

    @PostMapping
    public ResponseEntity<?> creerTrajet(@RequestBody TrajetRequest request) {
        try {
            Trajet trajet = trajetService.creerTrajet(
                request.getChauffeurId(),
                request.getDepart(),
                request.getDestination(),
                request.getDate(),
                request.getPrix(),
                request.getPlacesTotal()
            );
            return ResponseEntity.ok(trajet);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Trajet>> getTrajetsDisponibles() {
        return ResponseEntity.ok(trajetService.getTrajetsDisponibles());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Trajet>> getAllTrajets() {
        return ResponseEntity.ok(trajetService.getAllTrajets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrajetById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(trajetService.getTrajetById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/chauffeur/{chauffeurId}")
    public ResponseEntity<List<Trajet>> getTrajetsDeChauffeur(@PathVariable Long chauffeurId) {
        return ResponseEntity.ok(trajetService.getTrajetsDeChauffeur(chauffeurId));
    }

    @GetMapping("/rechercher")
    public ResponseEntity<List<Trajet>> rechercherTrajets(
            @RequestParam String depart,
            @RequestParam String destination,
            @RequestParam String date) {
        LocalDateTime dateTime = LocalDateTime.parse(date);
        return ResponseEntity.ok(trajetService.rechercherTrajets(depart, destination, dateTime));
    }

    @PutMapping("/annuler/{trajetId}")
    public ResponseEntity<?> annulerTrajet(
            @PathVariable Long trajetId,
            @RequestParam Long chauffeurId) {
        try {
            trajetService.annulerTrajet(trajetId, chauffeurId);
            return ResponseEntity.ok("Trajet annulé");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}