package com.uq.software.infrastructure.adapters;

import com.uq.software.domain.IncidentReport;
import com.uq.software.domain.IncidentReportRepository;
import com.uq.software.infrastructure.persistence.IncidentReportEntity;
import com.uq.software.infrastructure.persistence.IncidentReportJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class IncidentReportRepositoryAdapter implements IncidentReportRepository {

  private final IncidentReportJpaRepository incidentReportJpaRepository;

  public IncidentReportRepositoryAdapter(IncidentReportJpaRepository incidentReportJpaRepository) {
    this.incidentReportJpaRepository = incidentReportJpaRepository;
  }

  @Override
  public IncidentReport save(IncidentReport incidentReport) {
    IncidentReportEntity entity = new IncidentReportEntity(incidentReport);
    IncidentReportEntity savedEntity = incidentReportJpaRepository.save(entity);
    return savedEntity.toDomain();
  }

  @Override
  public Optional<IncidentReport> findById(Long id) {
    return incidentReportJpaRepository.findById(id).map(IncidentReportEntity::toDomain);
  }

  @Override
  public List<IncidentReport> findByDeliveryId(Long deliveryId) {
    return incidentReportJpaRepository.findByDeliveryId(deliveryId).stream()
        .map(IncidentReportEntity::toDomain)
        .collect(Collectors.toList());
  }

  @Override
  public List<IncidentReport> findByUserId(Long userId) {
    return incidentReportJpaRepository.findByUserId(userId).stream()
        .map(IncidentReportEntity::toDomain)
        .collect(Collectors.toList());
  }

  @Override
  public List<IncidentReport> findAll() {
    return incidentReportJpaRepository.findAll().stream()
        .map(IncidentReportEntity::toDomain)
        .collect(Collectors.toList());
  }
}
