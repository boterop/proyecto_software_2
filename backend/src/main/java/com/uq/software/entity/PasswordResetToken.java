package com.uq.software.entity;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String token;
  private Boolean isUsed = false;
  private Long userId;

  public PasswordResetToken(Long userId) {
    this.token = UUID.randomUUID().toString();
    this.userId = userId;
  }

  public PasswordResetToken(String token, Long userId) {
    this.token = token;
    this.userId = userId;
  }

  public PasswordResetToken(Long id, String token, Boolean isUsed, Long userId) {
    this.id = id;
    this.token = token;
    this.isUsed = isUsed;
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public String getToken() {
    return token;
  }

  public Boolean getIsUsed() {
    return isUsed;
  }

  public Long getUserId() {
    return userId;
  }

  public String toJSON() {
    return "{" +
        "\"id\":" + id +
        ", \"token\":\"" + token + "\"" +
        ", \"isUsed\":" + isUsed +
        ", \"userId\":\"" + userId + "\"" +
        "}";
  }

  public void markAsUsed() {
    this.isUsed = true;
  }
}
