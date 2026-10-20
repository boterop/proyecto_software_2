package com.uq.software.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uq.software.entity.IncidentReport;

import java.util.List;

@Repository
public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {
  List<IncidentReport> findByDeliveryId(Long deliveryId);

  List<IncidentReport> findByUserId(Long userId);
}
