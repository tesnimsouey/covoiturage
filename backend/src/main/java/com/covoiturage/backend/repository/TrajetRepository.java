package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.TrajetStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, Long> {
    List<Trajet> findByStatut(TrajetStatut statut);
    List<Trajet> findByChauffeurId(Long chauffeurId);
    List<Trajet> findByDepartAndDestinationAndDateAfter(
        String depart, String destination, LocalDateTime date);
}