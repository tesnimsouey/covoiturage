package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Reservation;
import com.covoiturage.backend.entity.ReservationStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPassagerId(Long passagerId);
    List<Reservation> findByTrajetId(Long trajetId);
    List<Reservation> findByStatut(ReservationStatut statut);
}