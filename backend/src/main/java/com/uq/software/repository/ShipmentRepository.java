package com.uq.software.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uq.software.entity.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  Optional<Shipment> findByTrackingCode(String trackingCode);

  List<Shipment> findBySenderId(Long senderId);
}
