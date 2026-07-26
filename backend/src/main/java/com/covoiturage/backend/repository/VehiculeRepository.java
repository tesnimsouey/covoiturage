package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByChauffeurId(Long chauffeurId);
    boolean existsByImmatriculation(String immatriculation);
}