package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.*;
import com.covoiturage.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TrajetRepository trajetRepository;
    private final NotificationService notificationService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Trajet> getAllTrajets() {
        return trajetRepository.findAll();
    }

    @Transactional
    public void suspendreUtilisateur(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setStatut(UserStatut.SUSPENDU);
        userRepository.save(user);
        notificationService.notifierEmail(user, "Votre compte a été suspendu par un administrateur");
    }

    @Transactional
    public void bloquerUtilisateur(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setStatut(UserStatut.BLOQUE);
        userRepository.save(user);
        notificationService.notifierEmail(user, "Votre compte a été bloqué par un administrateur");
    }

    @Transactional
    public void activerUtilisateur(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setStatut(UserStatut.ACTIF);
        userRepository.save(user);
        notificationService.notifierEmail(user, "Votre compte a été réactivé");
    }

    public List<User> getUsersByStatut(UserStatut statut) {
        return userRepository.findByStatut(statut);
    }
}