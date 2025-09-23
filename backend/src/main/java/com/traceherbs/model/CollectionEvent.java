package com.traceherbs.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class CollectionEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String collectorId;
    private String species;
    private double latitude;
    private double longitude;
    private LocalDateTime timestamp;
    private String quality;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCollectorId() { return collectorId; }
    public void setCollectorId(String collectorId) { this.collectorId = collectorId; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
}
