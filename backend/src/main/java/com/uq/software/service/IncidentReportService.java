package com.uq.software.service;

import com.uq.software.entity.IncidentReport;
import com.uq.software.repository.IncidentReportRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class IncidentReportService {

  private final IncidentReportRepository incidentReportRepository;

  public IncidentReportService(IncidentReportRepository incidentReportRepository) {
    this.incidentReportRepository = incidentReportRepository;
  }

  public IncidentReport create(IncidentReport incidentReport) {
    return incidentReportRepository.save(incidentReport);
  }

  public Optional<IncidentReport> getById(Long id) {
    return incidentReportRepository.findById(id);
  }

  public List<IncidentReport> getByDeliveryId(Long deliveryId) {
    return incidentReportRepository.findByDeliveryId(deliveryId);
  }

  public List<IncidentReport> getByUserId(Long userId) {
    return incidentReportRepository.findByUserId(userId);
  }
}
