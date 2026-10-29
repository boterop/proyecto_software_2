package com.uq.software.controller;

import com.uq.software.dto.AssignCourierRequest;
import com.uq.software.dto.CourierLoadResponse;
import com.uq.software.dto.ShipmentAssignmentResponse;
import com.uq.software.dto.ShipmentResponseDTO;
import com.uq.software.entity.Shipment;
import com.uq.software.service.CourierAssignmentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HU-06. Solo ADMIN (la regla /admin/** ya está en SecurityConfig). URLs reales: POST
 * /api/admin/shipments/{id}/assign, PUT /api/admin/shipments/{id}/reassign, GET
 * /api/admin/shipments/{id}/assignments, GET /api/admin/couriers
 */
@RestController
@RequestMapping("/admin")
public class CourierAssignmentController {

    private final CourierAssignmentService assignmentService;

    public CourierAssignmentController(CourierAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/shipments/{shipmentId}/assign")
    public ShipmentResponseDTO assign(
            @PathVariable Long shipmentId,
            @Valid @RequestBody AssignCourierRequest request,
            Authentication authentication) {
        Shipment shipment =
                assignmentService.assign(
                        shipmentId, request.courierId(), request.reason(), adminEmail(authentication));
        return toDTO(shipment);
    }

    @PutMapping("/shipments/{shipmentId}/reassign")
    public ShipmentResponseDTO reassign(
            @PathVariable Long shipmentId,
            @Valid @RequestBody AssignCourierRequest request,
            Authentication authentication) {
        Shipment shipment =
                assignmentService.reassign(
                        shipmentId, request.courierId(), request.reason(), adminEmail(authentication));
        return toDTO(shipment);
    }

    @GetMapping("/shipments/{shipmentId}/assignments")
    public List<ShipmentAssignmentResponse> history(@PathVariable Long shipmentId) {
        return assignmentService.getHistory(shipmentId).stream()
                .map(ShipmentAssignmentResponse::from)
                .toList();
    }

    @GetMapping("/couriers")
    public List<CourierLoadResponse> couriers() {
        return assignmentService.getCouriersWithLoad();
    }

    // en los tests la seguridad está abierta y puede no haber usuario autenticado
    private String adminEmail(Authentication authentication) {
        return authentication != null ? authentication.getName() : "desconocido";
    }

    // mismo mapeo que usa ShipmentController (HU-04)
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