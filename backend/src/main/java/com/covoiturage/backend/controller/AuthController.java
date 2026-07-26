package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.*;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if ("CHAUFFEUR".equalsIgnoreCase(request.getRole())) {
                return ResponseEntity.ok(authService.registerChauffeur(
                    request.getName(), request.getEmail(), request.getPassword()));
            } else {
                return ResponseEntity.ok(authService.registerPassager(
                    request.getName(), request.getEmail(), request.getPassword()));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatut().name()
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/suspendre/{userId}")
    public ResponseEntity<?> suspendre(@PathVariable Long userId) {
        try {
            authService.suspendreCompte(userId);
            return ResponseEntity.ok("Compte suspendu");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/bloquer/{userId}")
    public ResponseEntity<?> bloquer(@PathVariable Long userId) {
        try {
            authService.bloquerCompte(userId);
            return ResponseEntity.ok("Compte bloqué");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}