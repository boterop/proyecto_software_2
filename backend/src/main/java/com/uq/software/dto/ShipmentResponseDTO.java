package com.uq.software.dto;

public record ShipmentResponseDTO(
    Long id,
    String trackingCode,
    Long senderId,
    Long courierId,
    String originAddress,
    String destinationAddress,
    String receiverName,
    String receiverPhone,
    String receiverEmail,
    String packageDescription,
    Double lengthCm,
    Double widthCm,
    Double heightCm,
    Double weightKg,
    String status,
    Long createdAt) {
}
