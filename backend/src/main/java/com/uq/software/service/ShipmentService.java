package com.uq.software.service;

import com.uq.software.entity.Shipment;
import com.uq.software.repository.ShipmentRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ShipmentService {

  private final ShipmentRepository shipmentRepository;

  public ShipmentService(ShipmentRepository shipmentRepository) {
    this.shipmentRepository = shipmentRepository;
  }

  public Shipment create(Shipment shipment) {
    return shipmentRepository.save(shipment);
  }

  public Optional<Shipment> getById(Long id) {
    return shipmentRepository.findById(id);
  }

  public Optional<Shipment> getByTrackingCode(String trackingCode) {
    return shipmentRepository.findByTrackingCode(trackingCode);
  }

  public List<Shipment> getBySenderId(Long senderId) {
    return shipmentRepository.findBySenderId(senderId);
  }
}
