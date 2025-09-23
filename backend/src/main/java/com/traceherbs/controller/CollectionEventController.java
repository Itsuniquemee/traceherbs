package com.traceherbs.controller;

import com.traceherbs.model.CollectionEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.traceherbs.repository.CollectionEventRepository;
import java.util.List;

@RestController
@RequestMapping("/api/collection")
public class CollectionEventController {
    @Autowired
    private CollectionEventRepository repo;

    @PostMapping
    public CollectionEvent create(@RequestBody CollectionEvent event) {
        return repo.save(event);
    }

    @GetMapping
    public List<CollectionEvent> getAll() {
        return repo.findAll();
    }
}
