package com.traceherbs;

import com.traceherbs.model.CollectionEvent;
import com.traceherbs.model.QualityTest;
import com.traceherbs.model.ProcessingStep;
import com.traceherbs.repository.CollectionEventRepository;
import com.traceherbs.repository.QualityTestRepository;
import com.traceherbs.repository.ProcessingStepRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;

@Component
public class DemoDataLoader implements CommandLineRunner {
    @Autowired
    private CollectionEventRepository collectionRepo;
    @Autowired
    private QualityTestRepository qualityRepo;
    @Autowired
    private ProcessingStepRepository processingRepo;

    @Override
    public void run(String... args) throws Exception {
        if (collectionRepo.count() == 0) {
            CollectionEvent event = new CollectionEvent();
            event.setCollectorId("FARMER001");
            event.setSpecies("Ashwagandha");
            event.setLatitude(23.4567);
            event.setLongitude(77.1234);
            event.setTimestamp(LocalDateTime.now().minusDays(2));
            event.setQuality("A");
            event = collectionRepo.save(event);

            QualityTest qt = new QualityTest();
            qt.setCollectionEventId(event.getId());
            qt.setMoisture("12%");
            qt.setPesticide("None detected");
            qt.setDnaBarcode("ASHWA-2025-XYZ");
            qualityRepo.save(qt);

            ProcessingStep ps = new ProcessingStep();
            ps.setCollectionEventId(event.getId());
            ps.setStepType("Drying");
            ps.setDetails("Sun-dried for 48 hours");
            processingRepo.save(ps);
        }
    }
}
