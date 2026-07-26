package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.ReservationRequest;
import com.covoiturage.backend.entity.Reservation;
import com.covoiturage.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> creerReservation(@RequestBody ReservationRequest request) {
        try {
            Reservation reservation = reservationService.creerReservation(
                request.getPassagerId(),
                request.getTrajetId(),
                request.getMoyenPaiementId()
            );
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/passager/{passagerId}")
    public ResponseEntity<List<Reservation>> getReservationsPassager(@PathVariable Long passagerId) {
        return ResponseEntity.ok(reservationService.getReservationsPassager(passagerId));
    }

    @GetMapping("/trajet/{trajetId}")
    public ResponseEntity<List<Reservation>> getReservationsTrajet(@PathVariable Long trajetId) {
        return ResponseEntity.ok(reservationService.getReservationsTrajet(trajetId));
    }

    @PutMapping("/confirmer/{reservationId}")
    public ResponseEntity<?> confirmerReservation(@PathVariable Long reservationId) {
        try {
            reservationService.confirmerReservation(reservationId);
            return ResponseEntity.ok("Réservation confirmée");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/annuler/{reservationId}")
    public ResponseEntity<?> annulerReservation(
            @PathVariable Long reservationId,
            @RequestParam Long passagerId) {
        try {
            reservationService.annulerReservation(reservationId, passagerId);
            return ResponseEntity.ok("Réservation annulée");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}