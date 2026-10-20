package com.uq.software.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "incident_reports")
public class IncidentReport {

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

  public IncidentReport(Long deliveryId, Long userId, String incidentType, String description, String location,
      String status, String evidence, Long timestamp) {
    this.deliveryId = deliveryId;
    this.userId = userId;
    this.incidentType = incidentType;
    this.description = description;
    this.location = location;
    this.status = status;
    this.evidence = evidence;
    this.timestamp = timestamp;
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

  public String toJSON() {
    return "{" +
        "\"id\":" + id +
        ", \"deliveryId\":" + deliveryId +
        ", \"userId\":" + userId +
        ", \"incidentType\":\"" + incidentType + "\"" +
        ", \"description\":\"" + description + "\"" +
        ", \"location\":\"" + location + "\"" +
        ", \"status\":\"" + status + "\"" +
        ", \"evidence\":\"" + evidence + "\"" +
        ", \"timestamp\":" + timestamp +
        "}";
  }
}
