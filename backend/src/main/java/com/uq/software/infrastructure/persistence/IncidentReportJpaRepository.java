package com.uq.software.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentReportJpaRepository extends JpaRepository<IncidentReportEntity, Long> {
  List<IncidentReportEntity> findByDeliveryId(Long deliveryId);

  List<IncidentReportEntity> findByUserId(Long userId);
}
