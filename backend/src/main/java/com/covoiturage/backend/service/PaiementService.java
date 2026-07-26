package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaiementService {

    public void payer(Reservation reservation) {
        // Autorisation immédiate du paiement
        System.out.println("Paiement autorisé: " + reservation.getMontant() 
            + " DT via " + reservation.getMoyenPaiement().getType());
        reservation.getMoyenPaiement().payer(reservation.getMontant());
    }

    public void rembourser(Reservation reservation, double montant) {
        System.out.println("Remboursement: " + montant 
            + " DT via " + reservation.getMoyenPaiement().getType());
        reservation.getMoyenPaiement().rembourser(montant);
    }
}