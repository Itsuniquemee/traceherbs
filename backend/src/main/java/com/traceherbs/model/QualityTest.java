package com.traceherbs.model;

import jakarta.persistence.*;

@Entity
public class QualityTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long collectionEventId;
    private String moisture;
    private String pesticide;
    private String dnaBarcode;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCollectionEventId() { return collectionEventId; }
    public void setCollectionEventId(Long collectionEventId) { this.collectionEventId = collectionEventId; }
    public String getMoisture() { return moisture; }
    public void setMoisture(String moisture) { this.moisture = moisture; }
    public String getPesticide() { return pesticide; }
    public void setPesticide(String pesticide) { this.pesticide = pesticide; }
    public String getDnaBarcode() { return dnaBarcode; }
    public void setDnaBarcode(String dnaBarcode) { this.dnaBarcode = dnaBarcode; }
}
