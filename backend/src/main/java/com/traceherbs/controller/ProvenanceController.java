package com.traceherbs.controller;

import com.traceherbs.model.Provenance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.traceherbs.repository.ProvenanceRepository;

@RestController
@RequestMapping("/api/provenance")
public class ProvenanceController {
    @Autowired
    private ProvenanceRepository repo;

    @GetMapping("/{batchId}")
    public Provenance getByBatch(@PathVariable String batchId) {
        return repo.findByBatchId(batchId);
    }
}
