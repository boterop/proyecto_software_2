package com.uq.software.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.uq.software.entity.Shipment;
import com.uq.software.repository.ShipmentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ShipmentControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ShipmentRepository shipmentRepository;

  private static final String VALID_BODY =
      """
      {
        "senderId": 1,
        "originAddress": "Cra 14 #10-20, Armenia",
        "destinationAddress": "Calle 5 #20-30, Cali",
        "receiverName": "Ana Perez",
        "receiverPhone": "3001234567",
        "receiverEmail": "ana@mail.com",
        "packageDescription": "Caja con ropa",
        "lengthCm": 30,
        "widthCm": 20,
        "heightCm": 10,
        "weightKg": 2.5
      }
      """;

  private Shipment saved() {
    return shipmentRepository.save(
        new Shipment(1L, "A", "B", "Ana", "3001234567", null, "Caja", 30.0, 20.0, 10.0, 2.5));
  }

  @Test
  void createShipment_returns201_withPendingStatusAndTrackingCode() throws Exception {
    mockMvc
        .perform(post("/shipments").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.status").value("PENDING"))
        .andExpect(jsonPath("$.trackingCode", startsWith("UQ-")))
        .andExpect(jsonPath("$.courierId").isEmpty());
  }

  @Test
  void createShipment_ignoresClientProvidedStatusAndTrackingCode() throws Exception {
    String body =
        VALID_BODY.replace(
            "\"senderId\": 1,",
            "\"senderId\": 1, \"status\": \"DELIVERED\", \"trackingCode\": \"HACK\",");

    mockMvc
        .perform(post("/shipments").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.status").value("PENDING"))
        .andExpect(jsonPath("$.trackingCode", startsWith("UQ-")));
  }

  @Test
  void createShipment_emptyDestination_returns400() throws Exception {
    mockMvc
        .perform(
            post("/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BODY.replace("Calle 5 #20-30, Cali", "")))
        .andExpect(status().isBadRequest());

    assertEquals(0, shipmentRepository.count());
  }

  @Test
  void createShipment_missingDimensions_returns400() throws Exception {
    mockMvc
        .perform(
            post("/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BODY.replace("\"heightCm\": 10,", "")))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createShipment_withoutWeight_returns201() throws Exception {
    mockMvc
        .perform(
            post("/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BODY.replace(",\n  \"weightKg\": 2.5", "")))
        .andExpect(status().isCreated());
  }

  @Test
  void createShipment_emptyBody_returns400() throws Exception {
    mockMvc
        .perform(post("/shipments").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createShipment_negativeWeight_returns400() throws Exception {
    mockMvc
        .perform(
            post("/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BODY.replace("2.5", "-1")))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createShipment_invalidPhone_returns400() throws Exception {
    mockMvc
        .perform(
            post("/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BODY.replace("3001234567", "abc")))
        .andExpect(status().isBadRequest());
  }

  @Test
  void getShipmentById_returns200() throws Exception {
    Shipment shipment = saved();

    mockMvc
        .perform(get("/shipments/" + shipment.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.trackingCode").value(shipment.getTrackingCode()));
  }

  @Test
  void getShipmentById_notFound_returns404() throws Exception {
    mockMvc.perform(get("/shipments/999999")).andExpect(status().isNotFound());
  }

  @Test
  void getShipmentByTrackingCode_returns200() throws Exception {
    Shipment shipment = saved();

    mockMvc
        .perform(get("/shipments/tracking/" + shipment.getTrackingCode()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(shipment.getId()));
  }

  @Test
  void getShipmentByTrackingCode_notFound_returns404() throws Exception {
    mockMvc.perform(get("/shipments/tracking/UQ-NOTFOUND")).andExpect(status().isNotFound());
  }

  @Test
  void getShipmentsBySender_returnsList() throws Exception {
    saved();

    mockMvc
        .perform(get("/shipments/sender/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)));
  }
}
