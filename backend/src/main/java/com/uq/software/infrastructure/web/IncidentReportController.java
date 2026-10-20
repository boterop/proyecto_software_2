package com.uq.software.infrastructure.web;

import com.uq.software.application.dto.IncidentReportDTO;
import com.uq.software.application.mapper.IncidentReportMapper;
import com.uq.software.application.usecase.ReportIncidentUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incident-reports")
@CrossOrigin(origins = "*")
public class IncidentReportController {

  private final ReportIncidentUseCase reportIncidentUseCase;

  public IncidentReportController(ReportIncidentUseCase reportIncidentUseCase) {
    this.reportIncidentUseCase = reportIncidentUseCase;
  }

  @PostMapping
  public ResponseEntity<IncidentReportDTO> createIncidentReport(@RequestBody IncidentReportDTO incidentReportDTO) {
    var incidentReport = IncidentReportMapper.toDomain(incidentReportDTO);
    var savedIncidentReport = reportIncidentUseCase.createIncidentReport(incidentReport);
    return new ResponseEntity<>(IncidentReportMapper.toDTO(savedIncidentReport), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<IncidentReportDTO> getIncidentReport(@PathVariable Long id) {
    return reportIncidentUseCase.getIncidentReportById(id)
        .map(IncidentReportMapper::toDTO)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/delivery/{deliveryId}")
  public ResponseEntity<List<IncidentReportDTO>> getIncidentReportsByDelivery(@PathVariable Long deliveryId) {
    List<IncidentReportDTO> incidentReports = reportIncidentUseCase.getIncidentReportsByDeliveryId(deliveryId)
        .stream()
        .map(IncidentReportMapper::toDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok(incidentReports);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<IncidentReportDTO>> getIncidentReportsByUser(@PathVariable Long userId) {
    List<IncidentReportDTO> incidentReports = reportIncidentUseCase.getIncidentReportsByUserId(userId)
        .stream()
        .map(IncidentReportMapper::toDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok(incidentReports);
  }
}
