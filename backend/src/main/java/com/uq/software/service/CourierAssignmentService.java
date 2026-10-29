package com.uq.software.service;

import com.uq.software.dto.CourierLoadResponse;
import com.uq.software.entity.Role;
import com.uq.software.entity.Shipment;
import com.uq.software.entity.ShipmentAssignment;
import com.uq.software.entity.ShipmentStatus;
import com.uq.software.entity.User;
import com.uq.software.repository.ShipmentAssignmentRepository;
import com.uq.software.repository.ShipmentRepository;
import com.uq.software.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// HU-06: asignar y reasignar repartidores
@Service
public class CourierAssignmentService {

    // máximo de envíos activos que puede llevar un repartidor a la vez
    public static final int MAX_ACTIVE_SHIPMENTS = 5;

    // estados en los que el envío cuenta como "carga" del repartidor
    private static final List<ShipmentStatus> ACTIVE_STATUSES =
            List.of(ShipmentStatus.ASSIGNED, ShipmentStatus.IN_TRANSIT);

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final ShipmentAssignmentRepository assignmentRepository;

    public CourierAssignmentService(
            ShipmentRepository shipmentRepository,
            UserRepository userRepository,
            ShipmentAssignmentRepository assignmentRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    // Primera asignación: el envío tiene que estar PENDING
    @Transactional
    public Shipment assign(Long shipmentId, Long courierId, String reason, String adminEmail) {
        Shipment shipment = findShipment(shipmentId);

        if (shipment.getStatus() != ShipmentStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Solo se puede asignar un envío que esté PENDING");
        }

        checkCourierCanTakeShipment(courierId);

        // se reutiliza el método de HU-04: guarda el courierId y pasa a ASSIGNED
        shipment.assignCourier(courierId);
        shipmentRepository.save(shipment);
        assignmentRepository.save(
                new ShipmentAssignment(shipmentId, null, courierId, adminEmail, reason));
        return shipment;
    }

    // Reasignación: el envío tiene que estar ASSIGNED (todavía no salió) y hay que dar un motivo
    @Transactional
    public Shipment reassign(Long shipmentId, Long newCourierId, String reason, String adminEmail) {
        if (reason == null || reason.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Debes indicar el motivo de la reasignación");
        }

        Shipment shipment = findShipment(shipmentId);

        if (shipment.getStatus() != ShipmentStatus.ASSIGNED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Solo se puede reasignar un envío que esté ASSIGNED");
        }

        Long oldCourierId = shipment.getCourierId();
        if (newCourierId.equals(oldCourierId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El envío ya está asignado a ese repartidor");
        }

        checkCourierCanTakeShipment(newCourierId);

        shipment.assignCourier(newCourierId);
        shipmentRepository.save(shipment);
        assignmentRepository.save(
                new ShipmentAssignment(shipmentId, oldCourierId, newCourierId, adminEmail, reason.trim()));
        return shipment;
    }

    public List<ShipmentAssignment> getHistory(Long shipmentId) {
        findShipment(shipmentId); // para devolver 404 si el envío no existe
        return assignmentRepository.findByShipmentIdOrderByIdDesc(shipmentId);
    }

    // Lista de repartidores con su carga actual, para que el admin escoja
    public List<CourierLoadResponse> getCouriersWithLoad() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.REPARTIDOR)
                .map(
                        u -> {
                            long active = countActive(u.getId());
                            return new CourierLoadResponse(
                                    u.getId(), u.getName(), u.getEmail(), active, active < MAX_ACTIVE_SHIPMENTS);
                        })
                .toList();
    }

    // ---------- métodos privados ----------

    private Shipment findShipment(Long shipmentId) {
        return shipmentRepository
                .findById(shipmentId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El envío no existe"));
    }

    // Valida que el usuario exista, sea REPARTIDOR y no tenga la carga llena
    private void checkCourierCanTakeShipment(Long courierId) {
        User courier =
                userRepository
                        .findById(courierId)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El repartidor no existe"));

        if (courier.getRole() != Role.REPARTIDOR) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El usuario seleccionado no es un repartidor");
        }

        if (countActive(courierId) >= MAX_ACTIVE_SHIPMENTS) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El repartidor ya tiene el máximo de envíos activos (" + MAX_ACTIVE_SHIPMENTS + ")");
        }
    }

    private long countActive(Long courierId) {
        return shipmentRepository.countByCourierIdAndStatusIn(courierId, ACTIVE_STATUSES);
    }
}