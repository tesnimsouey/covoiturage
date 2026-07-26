package com.covoiturage.backend.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private Long passagerId;
    private Long trajetId;
    private Long moyenPaiementId;
}