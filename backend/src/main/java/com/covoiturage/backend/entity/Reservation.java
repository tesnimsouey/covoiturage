
package com.covoiturage.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatut statut = ReservationStatut.EN_ATTENTE;

    private LocalDateTime dateReservation = LocalDateTime.now();
    private LocalDateTime dateAnnulation;

    @Column(nullable = false)
    private double montant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passager_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "reservations", "moyensPaiement", "notifications", "password"})
    private Passager passager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trajet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "reservations", "chauffeur"})
    private Trajet trajet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moyen_paiement_id")
    private MoyenPaiement moyenPaiement;

    public void confirmerReservation() {
        if (statut != ReservationStatut.EN_ATTENTE)
            throw new IllegalStateException("Reservation ne peut pas être confirmée");
        statut = ReservationStatut.CONFIRMEE;
    }

    public void annulerReservation() {
        if (statut == ReservationStatut.ANNULEE)
            throw new IllegalStateException("Reservation déjà annulée");
        statut = ReservationStatut.ANNULEE;
        dateAnnulation = LocalDateTime.now();
        trajet.retirerPassager(passager);
    }

    private double calculerRemboursement() {
        long heuresAvantDepart = ChronoUnit.HOURS.between(LocalDateTime.now(), trajet.getDate());
        if (heuresAvantDepart > 24) {
            return montant; // Remboursement total
        } else {
            return montant * 0.5; // Remboursement partiel
        }
    }

    public double getRemboursement() {
        return calculerRemboursement();
    }
}