package com.uq.software.controller;

import com.uq.software.dto.UserProfileRequest;
import com.uq.software.dto.UserProfileResponse;
import com.uq.software.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

/** HU-02. URLs reales: GET/PUT /api/user-profiles/{userId} */
@RestController
@RequestMapping("/user-profiles")
public class UserProfileController {

  private final UserProfileService userProfileService;

  public UserProfileController(UserProfileService userProfileService) {
    this.userProfileService = userProfileService;
  }
  @PreAuthorize("hasRole('ADMIN') or @userProfileService.isOwner(#userId, authentication.name)")
  @GetMapping("/{userId}")
  public ResponseEntity<UserProfileResponse> get(@PathVariable Long userId) {
    return userProfileService
        .get(userId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
  @PreAuthorize("hasRole('ADMIN') or @userProfileService.isOwner(#userId, authentication.name)")
  @PutMapping("/{userId}")
  public ResponseEntity<UserProfileResponse> save(
      @PathVariable Long userId, @Valid @RequestBody UserProfileRequest request) {
    return userProfileService
        .save(userId, request)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
}
