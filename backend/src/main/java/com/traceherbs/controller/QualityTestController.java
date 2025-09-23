package com.traceherbs.controller;

import com.traceherbs.model.QualityTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.traceherbs.repository.QualityTestRepository;
import java.util.List;

@RestController
@RequestMapping("/api/qualitytest")
public class QualityTestController {
    @Autowired
    private QualityTestRepository repo;

    @PostMapping
    public QualityTest create(@RequestBody QualityTest test) {
        return repo.save(test);
    }

    @GetMapping
    public List<QualityTest> getAll() {
        return repo.findAll();
    }
}
