package com.uq.software.controller;

import com.uq.software.dto.AdminCreateUserRequest;
import com.uq.software.dto.RoleUpdateRequest;
import com.uq.software.dto.UserSummaryResponse;
import com.uq.software.entity.User;
import com.uq.software.service.UserAdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HU-02. Solo ADMIN (la regla /admin/** está en SecurityConfig). URLs reales: GET /api/admin/users,
 * GET /api/admin/users/{id}, POST /api/admin/users, PUT /api/admin/users/{id}/role, DELETE
 * /api/admin/users/{id}
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

  @PostMapping
  public ResponseEntity<UserSummaryResponse> create(
      @Valid @RequestBody AdminCreateUserRequest request) {
    User created =
        userAdminService.create(
            request.name(), request.email(), request.password(), request.role());
    return ResponseEntity.status(HttpStatus.CREATED).body(UserSummaryResponse.from(created));
  }

  /** El administrador no puede cambiar su propio rol (evita quedarse sin administradores). */
  @PutMapping("/{id}/role")
  public ResponseEntity<UserSummaryResponse> changeRole(
      @PathVariable Long id,
      @Valid @RequestBody RoleUpdateRequest request,
      Authentication authentication) {
    if (isSelf(id, authentication)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    return userAdminService
        .changeRole(id, request.role())
        .map(UserSummaryResponse::from)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /** El administrador no puede eliminar su propia cuenta. */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    if (isSelf(id, authentication)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    return userAdminService.delete(id)
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }

  private boolean isSelf(Long id, Authentication authentication) {
    return authentication != null && userAdminService.isSameUser(id, authentication.getName());
  }
}
