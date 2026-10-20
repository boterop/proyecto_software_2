package com.uq.software.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.uq.software.entity.IncidentReport;
import com.uq.software.repository.IncidentReportRepository;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class IncidentReportControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private IncidentReportRepository incidentReportRepository;

  private IncidentReport report = new IncidentReport(1L, 2L, "type", "description", "location", "status", "evidence",
      3L);

  @Test
  void testCreateIncidentReport() throws Exception {
    mockMvc.perform(post("/incident-reports")
        .contentType(MediaType.APPLICATION_JSON)
        .content(report.toJSON()))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.incidentType").value("type"));
  }

  @Test
  void testGetIncidentReport() throws Exception {
    IncidentReport created = incidentReportRepository.save(report);

    mockMvc.perform(get("/incident-reports/" + created.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(created.getId()))
        .andExpect(jsonPath("$.deliveryId").value(created.getDeliveryId()))
        .andExpect(jsonPath("$.userId").value(created.getUserId()))
        .andExpect(jsonPath("$.incidentType").value(created.getIncidentType()));
  }

  @Test
  void testGetIncidentReportByDeliveryID() throws Exception {
    IncidentReport created = incidentReportRepository.save(report);

    mockMvc.perform(get("/incident-reports/delivery/" + created.getDeliveryId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].id").value(created.getId()))
        .andExpect(jsonPath("$[0].deliveryId").value(created.getDeliveryId()))
        .andExpect(jsonPath("$[0].userId").value(created.getUserId()))
        .andExpect(jsonPath("$[0].incidentType").value(created.getIncidentType()));
  }

  @Test
  void testGetIncidentReportByUserID() throws Exception {
    IncidentReport created = incidentReportRepository.save(report);

    mockMvc.perform(get("/incident-reports/user/" + created.getUserId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].id").value(created.getId()))
        .andExpect(jsonPath("$[0].deliveryId").value(created.getDeliveryId()))
        .andExpect(jsonPath("$[0].userId").value(created.getUserId()))
        .andExpect(jsonPath("$[0].incidentType").value(created.getIncidentType()));
  }
}
