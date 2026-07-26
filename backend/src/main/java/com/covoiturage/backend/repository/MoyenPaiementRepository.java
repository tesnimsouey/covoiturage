package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.MoyenPaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MoyenPaiementRepository extends JpaRepository<MoyenPaiement, Long> {
    List<MoyenPaiement> findByPassagerId(Long passagerId);
}