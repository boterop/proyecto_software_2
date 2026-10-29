package com.uq.software.dto;

import com.uq.software.entity.ShipmentAssignment;

public record ShipmentAssignmentResponse(
        Long id,
        Long shipmentId,
        Long previousCourierId,
        Long newCourierId,
        String assignedBy,
        String reason,
        Long createdAt) {

    public static ShipmentAssignmentResponse from(ShipmentAssignment a) {
        return new ShipmentAssignmentResponse(
                a.getId(),
                a.getShipmentId(),
                a.getPreviousCourierId(),
                a.getNewCourierId(),
                a.getAssignedBy(),
                a.getReason(),
                a.getCreatedAt());
    }
}