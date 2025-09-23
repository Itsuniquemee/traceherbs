package com.traceherbs.repository;

import com.traceherbs.model.ProcessingStep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessingStepRepository extends JpaRepository<ProcessingStep, Long> {
}
