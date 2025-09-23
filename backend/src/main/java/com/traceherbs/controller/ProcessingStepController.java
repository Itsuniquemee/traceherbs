package com.traceherbs.controller;

import com.traceherbs.model.ProcessingStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.traceherbs.repository.ProcessingStepRepository;
import java.util.List;

@RestController
@RequestMapping("/api/processingstep")
public class ProcessingStepController {
    @Autowired
    private ProcessingStepRepository repo;

    @PostMapping
    public ProcessingStep create(@RequestBody ProcessingStep step) {
        return repo.save(step);
    }

    @GetMapping
    public List<ProcessingStep> getAll() {
        return repo.findAll();
    }
}
