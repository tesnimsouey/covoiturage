package com.covoiturage.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TrajetRequest {
    private Long chauffeurId;
    private String depart;
    private String destination;
    private LocalDateTime date;
    private double prix;
    private int placesTotal;
}