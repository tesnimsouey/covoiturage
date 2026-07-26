package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.*;
import com.covoiturage.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PassagerRepository passagerRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final MoyenPaiementRepository moyenPaiementRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Transactional
    public Passager registerPassager(String name, String email, String password) {
        if (userRepository.existsByEmail(email))
            throw new IllegalArgumentException("Email déjà utilisé");

        Passager passager = new Passager();
        passager.setName(name);
        passager.setEmail(email);
        passager.setPassword(passwordEncoder.encode(password));
        passager.setRole(UserRole.PASSAGER);
        passager.setStatut(UserStatut.ACTIF);

        Passager saved = passagerRepository.save(passager);

        // Créer automatiquement Cash + PayPal pour chaque nouveau passager
        MoyenPaiement cash = new MoyenPaiement();
        cash.setType("Espèces");
        cash.setDetails("Paiement en main propre");
        cash.setPassager(saved);
        moyenPaiementRepository.save(cash);

        MoyenPaiement paypal = new MoyenPaiement();
        paypal.setType("PayPal");
        paypal.setDetails(email);
        paypal.setPassager(saved);
        moyenPaiementRepository.save(paypal);

        notificationService.notifierEmail(saved, "Bienvenue sur CoVoiturage!");
        return saved;
    }

    @Transactional
    public Chauffeur registerChauffeur(String name, String email, String password) {
        if (userRepository.existsByEmail(email))
            throw new IllegalArgumentException("Email déjà utilisé");

        Chauffeur chauffeur = new Chauffeur();
        chauffeur.setName(name);
        chauffeur.setEmail(email);
        chauffeur.setPassword(passwordEncoder.encode(password));
        chauffeur.setRole(UserRole.CHAUFFEUR);
        chauffeur.setStatut(UserStatut.ACTIF);

        Chauffeur saved = chauffeurRepository.save(chauffeur);
        notificationService.notifierEmail(saved, "Bienvenue sur CoVoiturage!");
        return saved;
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

        if (user.getStatut() == UserStatut.BLOQUE)
            throw new IllegalStateException("Compte bloqué");

        if (user.getStatut() == UserStatut.SUSPENDU)
            throw new IllegalStateException("Compte suspendu");

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new IllegalArgumentException("Email ou mot de passe incorrect");

        return user;
    }

    @Transactional
    public void suspendreCompte(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setStatut(UserStatut.SUSPENDU);
        userRepository.save(user);
        notificationService.notifierEmail(user, "Votre compte a été suspendu");
    }

    @Transactional
    public void bloquerCompte(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setStatut(UserStatut.BLOQUE);
        userRepository.save(user);
        notificationService.notifierEmail(user, "Votre compte a été bloqué");
    }
}
