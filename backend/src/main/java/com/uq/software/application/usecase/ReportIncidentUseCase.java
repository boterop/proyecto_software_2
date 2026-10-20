package com.uq.software.application.usecase;

import com.uq.software.domain.IncidentReport;
import com.uq.software.domain.IncidentReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportIncidentUseCase {

  private final IncidentReportRepository incidentReportRepository;

  public ReportIncidentUseCase(IncidentReportRepository incidentReportRepository) {
    this.incidentReportRepository = incidentReportRepository;
  }

  public IncidentReport createIncidentReport(IncidentReport incidentReport) {
    return incidentReportRepository.save(incidentReport);
  }

  public Optional<IncidentReport> getIncidentReportById(Long id) {
    return incidentReportRepository.findById(id);
  }

  public List<IncidentReport> getIncidentReportsByDeliveryId(Long deliveryId) {
    return incidentReportRepository.findByDeliveryId(deliveryId);
  }

  public List<IncidentReport> getIncidentReportsByUserId(Long userId) {
    return incidentReportRepository.findByUserId(userId);
  }
}
