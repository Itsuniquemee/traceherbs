package com.traceherbs.model;

import jakarta.persistence.*;

@Entity
public class ProcessingStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long collectionEventId;
    private String stepType;
    private String details;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCollectionEventId() { return collectionEventId; }
    public void setCollectionEventId(Long collectionEventId) { this.collectionEventId = collectionEventId; }
    public String getStepType() { return stepType; }
    public void setStepType(String stepType) { this.stepType = stepType; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
