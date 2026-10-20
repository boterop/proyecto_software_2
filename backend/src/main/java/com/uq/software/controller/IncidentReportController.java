package com.uq.software.controller;

import com.uq.software.dto.IncidentReportDTO;
import com.uq.software.entity.IncidentReport;
import com.uq.software.service.IncidentReportService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/incident-reports")
public class IncidentReportController {

  private final IncidentReportService incidentReportService;

  public IncidentReportController(IncidentReportService incidentReportService) {
    this.incidentReportService = incidentReportService;
  }

  @PostMapping
  public ResponseEntity<IncidentReportDTO> create(@Valid @RequestBody IncidentReportDTO request) {
    IncidentReport created = incidentReportService.create(toDomain(request));
    return new ResponseEntity<>(toDTO(created), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<IncidentReportDTO> get(@PathVariable Long id) {
    return incidentReportService.getById(id)
        .map(this::toDTO)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/delivery/{deliveryId}")
  public ResponseEntity<List<IncidentReportDTO>> getByDelivery(@PathVariable Long deliveryId) {
    List<IncidentReportDTO> incidentReports = incidentReportService.getByDeliveryId(deliveryId)
        .stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok(incidentReports);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<IncidentReportDTO>> getByUser(@PathVariable Long userId) {
    List<IncidentReportDTO> incidentReports = incidentReportService.getByUserId(userId)
        .stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok(incidentReports);
  }

  private IncidentReportDTO toDTO(IncidentReport i) {
    IncidentReportDTO report = new IncidentReportDTO(i.getDeliveryId(), i.getUserId(), i.getIncidentType(),
        i.getDescription(),
        i.getLocation(), i.getStatus(), i.getEvidence(), i.getTimestamp());
    report.setId(i.getId());
    return report;
  }

  private IncidentReport toDomain(IncidentReportDTO i) {
    return new IncidentReport(i.getId(), i.getDeliveryId(), i.getUserId(), i.getIncidentType(),
        i.getDescription(),
        i.getLocation(), i.getStatus(), i.getEvidence(), i.getTimestamp());
  }
}
