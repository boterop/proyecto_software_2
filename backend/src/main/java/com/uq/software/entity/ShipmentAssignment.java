package com.uq.software.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// HU-06: cada fila es un movimiento (asignación o reasignación) de un envío.
@Entity
@Table(name = "shipment_assignments")
public class ShipmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shipmentId;

    // null cuando es la primera asignación
    private Long previousCourierId;

    @Column(nullable = false)
    private Long newCourierId;

    // correo del admin que hizo el cambio
    @Column(nullable = false)
    private String assignedBy;

    private String reason;

    @Column(nullable = false)
    private Long createdAt;

    protected ShipmentAssignment() {}

    public ShipmentAssignment(
            Long shipmentId,
            Long previousCourierId,
            Long newCourierId,
            String assignedBy,
            String reason) {
        this.shipmentId = shipmentId;
        this.previousCourierId = previousCourierId;
        this.newCourierId = newCourierId;
        this.assignedBy = assignedBy;
        this.reason = reason;
        this.createdAt = System.currentTimeMillis();
    }

    public Long getId() {
        return id;
    }

    public Long getShipmentId() {
        return shipmentId;
    }

    public Long getPreviousCourierId() {
        return previousCourierId;
    }

    public Long getNewCourierId() {
        return newCourierId;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public String getReason() {
        return reason;
    }

    public Long getCreatedAt() {
        return createdAt;
    }
}