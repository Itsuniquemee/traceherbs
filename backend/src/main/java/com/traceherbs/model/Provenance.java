package com.traceherbs.model;

import jakarta.persistence.*;

@Entity
public class Provenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String batchId;
    private Long collectionEventId;
    private Long qualityTestId;
    private Long processingStepId;
    private String qrCode;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }
    public Long getCollectionEventId() { return collectionEventId; }
    public void setCollectionEventId(Long collectionEventId) { this.collectionEventId = collectionEventId; }
    public Long getQualityTestId() { return qualityTestId; }
    public void setQualityTestId(Long qualityTestId) { this.qualityTestId = qualityTestId; }
    public Long getProcessingStepId() { return processingStepId; }
    public void setProcessingStepId(Long processingStepId) { this.processingStepId = processingStepId; }
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
}
