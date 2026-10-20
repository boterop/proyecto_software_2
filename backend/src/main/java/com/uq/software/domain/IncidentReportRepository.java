package com.uq.software.domain;

import java.util.List;
import java.util.Optional;

public interface IncidentReportRepository {
  IncidentReport save(IncidentReport incidentReport);

  Optional<IncidentReport> findById(Long id);

  List<IncidentReport> findByDeliveryId(Long deliveryId);

  List<IncidentReport> findByUserId(Long userId);

  List<IncidentReport> findAll();
}
