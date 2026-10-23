package com.uq.software.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "incident_reports")
public class IncidentReport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long deliveryId;

  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private String incidentType;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private String location;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false)
  private String evidence;

  @Column(nullable = false)
  private Long timestamp;

  protected IncidentReport() {}

  public IncidentReport(
      Long deliveryId,
      Long userId,
      String incidentType,
      String description,
      String location,
      String status,
      String evidence,
      Long timestamp) {
    this.deliveryId = deliveryId;
    this.userId = userId;
    this.incidentType = incidentType;
    this.description = description;
    this.location = location;
    this.status = status;
    this.evidence = evidence;
    this.timestamp = timestamp;
  }

  public IncidentReport(
      Long id,
      Long deliveryId,
      Long userId,
      String incidentType,
      String description,
      String location,
      String status,
      String evidence,
      Long timestamp) {
    this(deliveryId, userId, incidentType, description, location, status, evidence, timestamp);
    this.id = id;
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
    return "{"
        + "\"id\":"
        + id
        + ", \"deliveryId\":"
        + deliveryId
        + ", \"userId\":"
        + userId
        + ", \"incidentType\":\""
        + incidentType
        + "\""
        + ", \"description\":\""
        + description
        + "\""
        + ", \"location\":\""
        + location
        + "\""
        + ", \"status\":\""
        + status
        + "\""
        + ", \"evidence\":\""
        + evidence
        + "\""
        + ", \"timestamp\":"
        + timestamp
        + "}";
  }
}
