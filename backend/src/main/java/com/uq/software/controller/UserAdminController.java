package com.uq.software.controller;

import com.uq.software.dto.UserSummaryResponse;
import com.uq.software.service.UserAdminService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HU-02. URLs reales: GET /api/admin/users, GET /api/admin/users/{id}, DELETE /api/admin/users/{id}
 */
@RestController
@RequestMapping("/admin/users")
public class UserAdminController {

  private final UserAdminService userAdminService;

  public UserAdminController(UserAdminService userAdminService) {
    this.userAdminService = userAdminService;
  }

  @GetMapping
  public List<UserSummaryResponse> list() {
    return userAdminService.getAll().stream().map(UserSummaryResponse::from).toList();
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserSummaryResponse> get(@PathVariable Long id) {
    return userAdminService
        .getById(id)
        .map(UserSummaryResponse::from)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    return userAdminService.delete(id)
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }
}
