package com.covoiturage.backend.repository;
import java.util.List;
import com.covoiturage.backend.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    Optional<Chauffeur> findByEmail(String email);
    List<Chauffeur> findTop5ByOrderByRatingDesc();
}
