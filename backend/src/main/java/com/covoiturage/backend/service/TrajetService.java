package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.*;
import com.covoiturage.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrajetService {

    private final TrajetRepository trajetRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final NotificationService notificationService;

    @Transactional
    public Trajet creerTrajet(Long chauffeurId, String depart, String destination,
                               LocalDateTime date, double prix, int placesTotal) {
        Chauffeur chauffeur = chauffeurRepository.findById(chauffeurId)
            .orElseThrow(() -> new IllegalArgumentException("Chauffeur non trouvé"));

        Trajet trajet = new Trajet();
        trajet.setChauffeur(chauffeur);
        trajet.setDepart(depart);
        trajet.setDestination(destination);
        trajet.setDate(date);
        trajet.setPrix(prix);
        trajet.setPlacesTotal(placesTotal);
        trajet.setPlacesDisponibles(placesTotal);
        trajet.setStatut(TrajetStatut.OUVERT);

        return trajetRepository.save(trajet);
    }

    @Transactional
    public void annulerTrajet(Long trajetId, Long chauffeurId) {
        Trajet trajet = trajetRepository.findById(trajetId)
            .orElseThrow(() -> new IllegalArgumentException("Trajet non trouvé"));

        if (!trajet.getChauffeur().getId().equals(chauffeurId))
            throw new IllegalStateException("Vous n'êtes pas le chauffeur de ce trajet");

        if (!trajet.getReservations().isEmpty())
            throw new IllegalStateException("Impossible d'annuler: des réservations existent");

        trajet.setStatut(TrajetStatut.ANNULE);
        trajetRepository.save(trajet);
        notificationService.notifierEmail(trajet.getChauffeur(), 
            "Votre trajet " + trajet.getDepart() + " → " + trajet.getDestination() + " a été annulé");
    }

    public List<Trajet> getTrajetsDisponibles() {
        return trajetRepository.findByStatut(TrajetStatut.OUVERT);
    }

    public List<Trajet> rechercherTrajets(String depart, String destination, LocalDateTime date) {
        return trajetRepository.findByDepartAndDestinationAndDateAfter(depart, destination, date);
    }

    public List<Trajet> getTrajetsDeChauffeur(Long chauffeurId) {
        return trajetRepository.findByChauffeurId(chauffeurId);
    }

    public List<Trajet> getAllTrajets() {
        return trajetRepository.findAll();
    }

    public Trajet getTrajetById(Long id) {
        return trajetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Trajet non trouvé"));
    }
}