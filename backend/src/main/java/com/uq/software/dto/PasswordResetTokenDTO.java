package com.uq.software.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PasswordResetTokenDTO {
  private Long id;
  @NotBlank(message = "Token is required")
  private String token;
  private Boolean isUsed = false;
  @NotNull(message = "User ID is required")
  private Long userId;

  public PasswordResetTokenDTO(Long id, String token, Boolean isUsed, Long userId) {
    this.id = id;
    this.token = token;
    this.isUsed = isUsed;
    this.userId = userId;
  }

  public PasswordResetTokenDTO(String token, Long userId) {
    this.token = token;
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public Boolean getIsUsed() {
    return isUsed;
  }

  public void setIsUsed(Boolean isUsed) {
    this.isUsed = isUsed;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }
}
