package com.covoiturage.backend.controller;

import com.covoiturage.backend.entity.*;
import com.covoiturage.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/trajets")
    public ResponseEntity<List<Trajet>> getAllTrajets() {
        return ResponseEntity.ok(adminService.getAllTrajets());
    }

    @PutMapping("/suspendre/{userId}")
    public ResponseEntity<?> suspendreUtilisateur(@PathVariable Long userId) {
        try {
            adminService.suspendreUtilisateur(userId);
            return ResponseEntity.ok("Utilisateur suspendu");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/bloquer/{userId}")
    public ResponseEntity<?> bloquerUtilisateur(@PathVariable Long userId) {
        try {
            adminService.bloquerUtilisateur(userId);
            return ResponseEntity.ok("Utilisateur bloqué");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/activer/{userId}")
    public ResponseEntity<?> activerUtilisateur(@PathVariable Long userId) {
        try {
            adminService.activerUtilisateur(userId);
            return ResponseEntity.ok("Utilisateur activé");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}