package com.covoiturage.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chauffeurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"vehicules", "trajets"})
@EqualsAndHashCode(callSuper = true)
public class Chauffeur extends User {

    private double rating = 0.0;

    @OneToMany(mappedBy = "chauffeur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicule> vehicules = new ArrayList<>();

    @OneToMany(mappedBy = "chauffeur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Trajet> trajets = new ArrayList<>();

    // Copie défensive
    public List<Vehicule> getVehicules() {
        return new ArrayList<>(vehicules);
    }

    // Copie défensive
    public List<Trajet> getTrajets() {
        return new ArrayList<>(trajets);
    }

    protected void appliquerPenalite(Passager passager, double montant) {
        System.out.println("Penalite de " + montant + " appliquee pour " + passager.getName());
    }
}