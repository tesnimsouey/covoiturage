package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.entity.UserStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByStatut(UserStatut statut);
}