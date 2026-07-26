package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.*;
import com.covoiturage.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TrajetRepository trajetRepository;
    private final PassagerRepository passagerRepository;
    private final MoyenPaiementRepository moyenPaiementRepository;
    private final NotificationService notificationService;
    private final PaiementService paiementService;

    @Transactional
    public Reservation creerReservation(Long passagerId, Long trajetId, Long moyenPaiementId) {
        Passager passager = passagerRepository.findById(passagerId)
            .orElseThrow(() -> new IllegalArgumentException("Passager non trouvé"));

        Trajet trajet = trajetRepository.findById(trajetId)
            .orElseThrow(() -> new IllegalArgumentException("Trajet non trouvé"));

        MoyenPaiement moyenPaiement = moyenPaiementRepository.findById(moyenPaiementId)
            .orElseThrow(() -> new IllegalArgumentException("Moyen de paiement non trouvé"));

        if (trajet.getStatut() != TrajetStatut.OUVERT)
            throw new IllegalStateException("Trajet non disponible");

        Reservation reservation = new Reservation();
        reservation.setPassager(passager);
        reservation.setTrajet(trajet);
        reservation.setMoyenPaiement(moyenPaiement);
        reservation.setMontant(trajet.getPrix());
        reservation.setStatut(ReservationStatut.EN_ATTENTE);

        trajet.ajouterPassager(passager);
        trajetRepository.save(trajet);

        Reservation saved = reservationRepository.save(reservation);

        paiementService.payer(saved);

        notificationService.notifierEmail(passager,
            "Réservation confirmée pour " + trajet.getDepart() + " → " + trajet.getDestination());
        notificationService.notifierEmail(trajet.getChauffeur(),
            "Nouveau passager: " + passager.getName());

        return saved;
    }

    @Transactional
    public void annulerReservation(Long reservationId, Long passagerId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

        if (!reservation.getPassager().getId().equals(passagerId))
            throw new IllegalStateException("Non autorisé");

        double remboursement = reservation.getRemboursement();
        reservation.annulerReservation();
        reservationRepository.save(reservation);

        paiementService.rembourser(reservation, remboursement);

        notificationService.notifierEmail(reservation.getPassager(),
            "Réservation annulée. Remboursement: " + remboursement + " DT");
    }

    @Transactional
    public void confirmerReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

        reservation.confirmerReservation();
        reservationRepository.save(reservation);

        notificationService.notifierEmail(reservation.getPassager(),
            "Votre réservation a été confirmée par le chauffeur!");
    }

    public List<Reservation> getReservationsPassager(Long passagerId) {
        return reservationRepository.findByPassagerId(passagerId);
    }

    public List<Reservation> getReservationsTrajet(Long trajetId) {
        return reservationRepository.findByTrajetId(trajetId);
    }
}