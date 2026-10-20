package com.uq.software.application.dto;

public class IncidentReportDTO {
  private Long id;
  private Long deliveryId;
  private Long userId;
  private String incidentType;
  private String description;
  private String location;
  private String status;
  private String evidence;
  private Long timestamp;

  public IncidentReportDTO() {
  }

  public IncidentReportDTO(Long id, Long deliveryId, Long userId, String incidentType, String description,
      String location, String status, String evidence, Long timestamp) {
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

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDeliveryId() {
    return deliveryId;
  }

  public void setDeliveryId(Long deliveryId) {
    this.deliveryId = deliveryId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getIncidentType() {
    return incidentType;
  }

  public void setIncidentType(String incidentType) {
    this.incidentType = incidentType;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getEvidence() {
    return evidence;
  }

  public void setEvidence(String evidence) {
    this.evidence = evidence;
  }

  public Long getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Long timestamp) {
    this.timestamp = timestamp;
  }
}
