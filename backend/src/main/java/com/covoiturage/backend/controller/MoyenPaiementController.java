package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.MoyenPaiementRequest;
import com.covoiturage.backend.entity.MoyenPaiement;
import com.covoiturage.backend.entity.Passager;
import com.covoiturage.backend.repository.MoyenPaiementRepository;
import com.covoiturage.backend.repository.PassagerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
public class MoyenPaiementController {

    private final MoyenPaiementRepository moyenPaiementRepository;
    private final PassagerRepository passagerRepository;

    @PostMapping
    public ResponseEntity<?> ajouterMoyenPaiement(@RequestBody MoyenPaiementRequest request) {
        try {
            Passager passager = passagerRepository.findById(request.getPassagerId())
                .orElseThrow(() -> new IllegalArgumentException("Passager non trouvé"));

            MoyenPaiement moyen = new MoyenPaiement();
            moyen.setPassager(passager);
            moyen.setType(request.getType());
            moyen.setDetails(request.getDetails());

            return ResponseEntity.ok(moyenPaiementRepository.save(moyen));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/passager/{passagerId}")
    public ResponseEntity<List<MoyenPaiement>> getMoyensPaiement(@PathVariable Long passagerId) {
        return ResponseEntity.ok(moyenPaiementRepository.findByPassagerId(passagerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerMoyenPaiement(@PathVariable Long id) {
        moyenPaiementRepository.deleteById(id);
        return ResponseEntity.ok("Moyen de paiement supprimé");
    }
}