package com.uq.software.application.mapper;

import com.uq.software.application.dto.IncidentReportDTO;
import com.uq.software.domain.IncidentReport;

public class IncidentReportMapper {

  public static IncidentReportDTO toDTO(IncidentReport incidentReport) {
    return new IncidentReportDTO(
        incidentReport.getId(),
        incidentReport.getDeliveryId(),
        incidentReport.getUserId(),
        incidentReport.getIncidentType(),
        incidentReport.getDescription(),
        incidentReport.getLocation(),
        incidentReport.getStatus(),
        incidentReport.getEvidence(),
        incidentReport.getTimestamp());
  }

  public static IncidentReport toDomain(IncidentReportDTO incidentReportDTO) {
    return new IncidentReport(
        incidentReportDTO.getId(),
        incidentReportDTO.getDeliveryId(),
        incidentReportDTO.getUserId(),
        incidentReportDTO.getIncidentType(),
        incidentReportDTO.getDescription(),
        incidentReportDTO.getLocation(),
        incidentReportDTO.getStatus(),
        incidentReportDTO.getEvidence(),
        incidentReportDTO.getTimestamp());
  }
}
