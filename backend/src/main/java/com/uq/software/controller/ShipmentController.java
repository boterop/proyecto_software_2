package com.uq.software.controller;

import com.uq.software.dto.ShipmentRequestDTO;
import com.uq.software.dto.ShipmentResponseDTO;
import com.uq.software.entity.Shipment;
import com.uq.software.service.ShipmentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shipments")
public class ShipmentController {

  private final ShipmentService shipmentService;

  public ShipmentController(ShipmentService shipmentService) {
    this.shipmentService = shipmentService;
  }

  @PostMapping
  public ResponseEntity<ShipmentResponseDTO> create(
      @Valid @RequestBody ShipmentRequestDTO request) {
    Shipment created = shipmentService.create(toDomain(request));
    return new ResponseEntity<>(toDTO(created), HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<ShipmentResponseDTO>> getAll() {
    return ResponseEntity.ok(shipmentService.findAll().stream().map(this::toDTO).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ShipmentResponseDTO> get(@PathVariable Long id) {
    return shipmentService
        .getById(id)
        .map(this::toDTO)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/tracking/{trackingCode}")
  public ResponseEntity<ShipmentResponseDTO> getByTrackingCode(@PathVariable String trackingCode) {
    return shipmentService
        .getByTrackingCode(trackingCode)
        .map(this::toDTO)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/sender/{senderId}")
  public ResponseEntity<List<ShipmentResponseDTO>> getBySender(@PathVariable Long senderId) {
    return ResponseEntity.ok(
        shipmentService.getBySenderId(senderId).stream().map(this::toDTO).toList());
  }

  private Shipment toDomain(ShipmentRequestDTO request) {
    return new Shipment(
        request.senderId(),
        request.originAddress().trim(),
        request.destinationAddress().trim(),
        request.receiverName().trim(),
        request.receiverPhone().trim(),
        request.receiverEmail(),
        request.packageDescription().trim(),
        request.lengthCm(),
        request.widthCm(),
        request.heightCm(),
        request.weightKg());
  }

  private ShipmentResponseDTO toDTO(Shipment shipment) {
    return new ShipmentResponseDTO(
        shipment.getId(),
        shipment.getTrackingCode(),
        shipment.getSenderId(),
        shipment.getCourierId(),
        shipment.getOriginAddress(),
        shipment.getDestinationAddress(),
        shipment.getReceiverName(),
        shipment.getReceiverPhone(),
        shipment.getReceiverEmail(),
        shipment.getPackageDescription(),
        shipment.getLengthCm(),
        shipment.getWidthCm(),
        shipment.getHeightCm(),
        shipment.getWeightKg(),
        shipment.getStatus().name(),
        shipment.getCreatedAt());
  }
}
