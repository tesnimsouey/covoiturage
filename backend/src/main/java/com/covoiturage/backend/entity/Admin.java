package com.covoiturage.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {

    public void suspendreUtilisateur(User user) {
        user.setStatut(UserStatut.SUSPENDU);
    }

    public void bloquerUtilisateur(User user) {
        user.setStatut(UserStatut.BLOQUE);
    }
}