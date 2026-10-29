package com.uq.software.repository;

import com.uq.software.entity.Shipment;
import com.uq.software.entity.ShipmentStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  List<Shipment> findAll();

  Optional<Shipment> findByTrackingCode(String trackingCode);

  List<Shipment> findBySenderId(Long senderId);

  // HU-06: para saber cuántos envíos activos tiene un repartidor
  long countByCourierIdAndStatusIn(Long courierId, List<ShipmentStatus> statuses);
}
