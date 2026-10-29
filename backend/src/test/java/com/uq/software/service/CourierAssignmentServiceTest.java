package com.uq.software.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.uq.software.entity.Role;
import com.uq.software.entity.Shipment;
import com.uq.software.entity.ShipmentAssignment;
import com.uq.software.entity.ShipmentStatus;
import com.uq.software.entity.User;
import com.uq.software.repository.ShipmentAssignmentRepository;
import com.uq.software.repository.ShipmentRepository;
import com.uq.software.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CourierAssignmentServiceTest {

  @Mock private ShipmentRepository shipmentRepository;
  @Mock private UserRepository userRepository;
  @Mock private ShipmentAssignmentRepository assignmentRepository;

  @InjectMocks private CourierAssignmentService service;

  private Shipment newShipment() {
    return new Shipment(1L, "A", "B", "Ana", "3001234567", null, "Caja", 30.0, 20.0, 10.0, 2.5);
  }

  private User courier() {
    return new User("Pedro", "pedro@mail.com", "123", Role.REPARTIDOR);
  }

  @Test
  void assign_ok_changesStatusAndSavesHistory() {
    Shipment shipment = newShipment();
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));
    when(userRepository.findById(10L)).thenReturn(Optional.of(courier()));
    when(shipmentRepository.countByCourierIdAndStatusIn(anyLong(), anyList())).thenReturn(0L);

    Shipment result = service.assign(1L, 10L, null, "admin@mail.com");

    assertEquals(ShipmentStatus.ASSIGNED, result.getStatus());
    assertEquals(10L, result.getCourierId());
    verify(assignmentRepository).save(any(ShipmentAssignment.class));
  }

  @Test
  void assign_shipmentAlreadyAssigned_throwsConflict() {
    Shipment shipment = newShipment();
    shipment.assignCourier(5L);
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));

    assertThrows(ResponseStatusException.class, () -> service.assign(1L, 10L, null, "admin"));
    verify(assignmentRepository, never()).save(any());
  }

  @Test
  void assign_userIsNotCourier_throwsBadRequest() {
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(newShipment()));
    when(userRepository.findById(10L))
        .thenReturn(Optional.of(new User("Ana", "ana@mail.com", "123", Role.CLIENTE_EMISOR)));

    assertThrows(ResponseStatusException.class, () -> service.assign(1L, 10L, null, "admin"));
  }

  @Test
  void assign_courierWithFullLoad_throwsConflict() {
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(newShipment()));
    when(userRepository.findById(10L)).thenReturn(Optional.of(courier()));
    when(shipmentRepository.countByCourierIdAndStatusIn(anyLong(), anyList()))
        .thenReturn((long) CourierAssignmentService.MAX_ACTIVE_SHIPMENTS);

    assertThrows(ResponseStatusException.class, () -> service.assign(1L, 10L, null, "admin"));
    verify(assignmentRepository, never()).save(any());
  }

  @Test
  void reassign_ok_keepsOldCourierInHistory() {
    Shipment shipment = newShipment();
    shipment.assignCourier(5L);
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));
    when(userRepository.findById(10L)).thenReturn(Optional.of(courier()));
    when(shipmentRepository.countByCourierIdAndStatusIn(anyLong(), anyList())).thenReturn(1L);

    Shipment result = service.reassign(1L, 10L, "Se dañó la moto", "admin@mail.com");

    assertEquals(10L, result.getCourierId());
    assertEquals(ShipmentStatus.ASSIGNED, result.getStatus());
    verify(assignmentRepository).save(any(ShipmentAssignment.class));
  }

  @Test
  void reassign_withoutReason_throwsBadRequest() {
    assertThrows(ResponseStatusException.class, () -> service.reassign(1L, 10L, "  ", "admin"));
  }

  @Test
  void reassign_sameCourier_throwsConflict() {
    Shipment shipment = newShipment();
    shipment.assignCourier(10L);
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));

    assertThrows(ResponseStatusException.class, () -> service.reassign(1L, 10L, "motivo", "admin"));
  }

  @Test
  void reassign_pendingShipment_throwsConflict() {
    when(shipmentRepository.findById(1L)).thenReturn(Optional.of(newShipment()));

    assertThrows(ResponseStatusException.class, () -> service.reassign(1L, 10L, "motivo", "admin"));
  }
}
