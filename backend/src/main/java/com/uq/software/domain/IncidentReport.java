package com.uq.software.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class IncidentReport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long deliveryId;
  private Long userId;
  private String incidentType;
  private String description;
  private String location;
  private String status;
  private String evidence;
  private Long timestamp;

  public IncidentReport() {
  }

  public IncidentReport(Long id, Long deliveryId, Long userId, String incidentType, String description, String location,
      String status, String evidence, Long timestamp) {
    this.id = id;
    this.deliveryId = deliveryId;
    this.userId = userId;
    this.incidentType = incidentType;
    this.description = description;
    this.location = location;
    this.status = status;
    this.evidence = evidence;
    this.timestamp = timestamp;
  }

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
