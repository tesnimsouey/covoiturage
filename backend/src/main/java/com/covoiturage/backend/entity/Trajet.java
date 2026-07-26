package com.covoiturage.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "trajets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "reservations")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Trajet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String depart;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private double prix;

    @Column(nullable = false)
    private int placesTotal;

    @Column(nullable = false)
    private int placesDisponibles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrajetStatut statut = TrajetStatut.OUVERT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chauffeur_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "trajets", "vehicules", "notifications", "password"})
    private Chauffeur chauffeur;

    @OneToMany(mappedBy = "trajet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations = new ArrayList<>();

    // Copie défensive
    public List<Reservation> getReservations() {
        return new ArrayList<>(reservations);
    }

    public void ajouterPassager(Passager passager) {
        if (placesDisponibles <= 0) throw new IllegalStateException("Plus de places disponibles");
        placesDisponibles--;
        cloreTrajetSiComplet();
    }

    public void retirerPassager(Passager passager) {
        if (statut == TrajetStatut.ANNULE) throw new IllegalStateException("Trajet annulé");
        placesDisponibles++;
        if (statut == TrajetStatut.COMPLET) statut = TrajetStatut.OUVERT;
    }

    private void cloreTrajetSiComplet() {
        if (placesDisponibles == 0) statut = TrajetStatut.COMPLET;
    }

}