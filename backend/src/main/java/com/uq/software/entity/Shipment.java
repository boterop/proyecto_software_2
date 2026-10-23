package com.uq.software.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "shipments")
public class Shipment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false, updatable = false)
  private String trackingCode;

  @Column(nullable = false)
  private Long senderId;

  private Long courierId;

  @Column(nullable = false)
  private String originAddress;

  @Column(nullable = false)
  private String destinationAddress;

  @Column(nullable = false)
  private String receiverName;

  @Column(nullable = false)
  private String receiverPhone;

  private String receiverEmail;

  @Column(nullable = false)
  private String packageDescription;

  @Column(nullable = false)
  private Double lengthCm;

  @Column(nullable = false)
  private Double widthCm;

  @Column(nullable = false)
  private Double heightCm;

  private Double weightKg;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ShipmentStatus status;

  @Column(nullable = false)
  private Long createdAt;

  protected Shipment() {}

  public Shipment(
      Long senderId,
      String originAddress,
      String destinationAddress,
      String receiverName,
      String receiverPhone,
      String receiverEmail,
      String packageDescription,
      Double lengthCm,
      Double widthCm,
      Double heightCm,
      Double weightKg) {
    this.trackingCode = generateTrackingCode();
    this.senderId = senderId;
    this.originAddress = originAddress;
    this.destinationAddress = destinationAddress;
    this.receiverName = receiverName;
    this.receiverPhone = receiverPhone;
    this.receiverEmail = receiverEmail;
    this.packageDescription = packageDescription;
    this.lengthCm = lengthCm;
    this.widthCm = widthCm;
    this.heightCm = heightCm;
    this.weightKg = weightKg;
    this.status = ShipmentStatus.PENDING;
    this.createdAt = System.currentTimeMillis();
  }

  private static String generateTrackingCode() {
    return "UQ-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
  }

  public void assignCourier(Long courierId) {
    this.courierId = courierId;
    this.status = ShipmentStatus.ASSIGNED;
  }

  public Long getId() {
    return id;
  }

  public String getTrackingCode() {
    return trackingCode;
  }

  public Long getSenderId() {
    return senderId;
  }

  public Long getCourierId() {
    return courierId;
  }

  public String getOriginAddress() {
    return originAddress;
  }

  public String getDestinationAddress() {
    return destinationAddress;
  }

  public String getReceiverName() {
    return receiverName;
  }

  public String getReceiverPhone() {
    return receiverPhone;
  }

  public String getReceiverEmail() {
    return receiverEmail;
  }

  public String getPackageDescription() {
    return packageDescription;
  }

  public Double getLengthCm() {
    return lengthCm;
  }

  public Double getWidthCm() {
    return widthCm;
  }

  public Double getHeightCm() {
    return heightCm;
  }

  public Double getWeightKg() {
    return weightKg;
  }

  public ShipmentStatus getStatus() {
    return status;
  }

  public Long getCreatedAt() {
    return createdAt;
  }
}
