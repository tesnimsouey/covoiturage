
package com.covoiturage.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "passagers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"reservations", "moyensPaiement"})
@EqualsAndHashCode(callSuper = true)
public class Passager extends User {

    @OneToMany(mappedBy = "passager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "passager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MoyenPaiement> moyensPaiement = new ArrayList<>();

    // Copie défensive
    public List<Reservation> getReservations() {
        return new ArrayList<>(reservations);
    }

    // Copie défensive
    public List<MoyenPaiement> getMoyensPaiement() {
        return new ArrayList<>(moyensPaiement);
    }

    public void evaluerChauffeur(Chauffeur chauffeur, int note) {
        if (note < 1 || note > 5) throw new IllegalArgumentException("Note doit être entre 1 et 5");
        double newRating = (chauffeur.getRating() + note) / 2;
        chauffeur.setRating(newRating);
    }

    public double consulterNotesChauffeur(Chauffeur chauffeur) {
        return chauffeur.getRating();
    }
}