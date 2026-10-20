package com.uq.software.infrastructure.persistence;

import com.uq.software.domain.IncidentReport;
import jakarta.persistence.*;

@Entity
@Table(name = "incident_reports")
public class IncidentReportEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private Long deliveryId;
  private Long userId;
  private String incidentType;
  private String description;
  private String location;
  private String status;
  private String evidence;
  private Long timestamp;

  protected IncidentReportEntity() {
  }

  public IncidentReportEntity(IncidentReport incidentReport) {
    this.id = incidentReport.getId();
    this.deliveryId = incidentReport.getDeliveryId();
    this.userId = incidentReport.getUserId();
    this.incidentType = incidentReport.getIncidentType();
    this.description = incidentReport.getDescription();
    this.location = incidentReport.getLocation();
    this.status = incidentReport.getStatus();
    this.evidence = incidentReport.getEvidence();
    this.timestamp = incidentReport.getTimestamp();
  }

  public IncidentReport toDomain() {
    return new IncidentReport(id, deliveryId, userId, incidentType, description, location, status, evidence, timestamp);
  }

  // Getters
  public Long getId() {
    return id;
  }

  public Long getDeliveryId() {
    return deliveryId;
  }

  public Long getUserId() {
    return userId;
  }

  public String getIncidentType() {
    return incidentType;
  }

  public String getDescription() {
    return description;
  }

  public String getLocation() {
    return location;
  }

  public String getStatus() {
    return status;
  }

  public String getEvidence() {
    return evidence;
  }

  public Long getTimestamp() {
    return timestamp;
  }
}
