package com.covoiturage.backend.dto;

import lombok.Data;

@Data
public class MoyenPaiementRequest {
    private Long passagerId;
    private String type;
    private String details;
}