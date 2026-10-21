package com.uq.software.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uq.software.entity.Shipment;
import com.uq.software.entity.ShipmentStatus;
import com.uq.software.repository.ShipmentRepository;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

  @Mock
  private ShipmentRepository repository;

  @InjectMocks
  private ShipmentService service;

  @Test
  void create_savesAndReturnsShipment() {
    Shipment shipment = new Shipment(
        1L, "A", "B", "Ana", "3001234567", null, "Caja", 30.0, 20.0, 10.0, 2.5);
    when(repository.save(shipment)).thenReturn(shipment);

    Shipment result = service.create(shipment);

    assertEquals(ShipmentStatus.PENDING, result.getStatus());
    verify(repository).save(shipment);
  }

  @Test
  void getByTrackingCode_notFound_returnsEmpty() {
    when(repository.findByTrackingCode("X")).thenReturn(Optional.empty());

    assertTrue(service.getByTrackingCode("X").isEmpty());
  }

  @Test
  void trackingCodes_areUnique() {
    Shipment first = new Shipment(
        1L, "A", "B", "Ana", "3001234567", null, "Caja", 30.0, 20.0, 10.0, 1.0);
    Shipment second = new Shipment(
        1L, "A", "B", "Ana", "3001234567", null, "Caja", 30.0, 20.0, 10.0, 1.0);

    assertNotEquals(first.getTrackingCode(), second.getTrackingCode());
  }
}
