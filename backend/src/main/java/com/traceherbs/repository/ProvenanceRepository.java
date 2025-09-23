package com.traceherbs.repository;

import com.traceherbs.model.Provenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvenanceRepository extends JpaRepository<Provenance, Long> {
    Provenance findByBatchId(String batchId);
}
