package com.uq.software.repository;

import com.uq.software.entity.Shipment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  List<Shipment> findAll();

  Optional<Shipment> findByTrackingCode(String trackingCode);

  List<Shipment> findBySenderId(Long senderId);
}
