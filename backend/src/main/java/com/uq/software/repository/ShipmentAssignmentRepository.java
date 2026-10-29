package com.uq.software.repository;

import com.uq.software.entity.ShipmentAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentAssignmentRepository extends JpaRepository<ShipmentAssignment, Long> {

    List<ShipmentAssignment> findByShipmentIdOrderByIdDesc(Long shipmentId);
}