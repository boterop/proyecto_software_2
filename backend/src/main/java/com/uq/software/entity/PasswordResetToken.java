package com.uq.software.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(unique = true, nullable = false)
  private String token;

  @Column(nullable = false)
  private Boolean isUsed = false;

  @Column(nullable = false)
  private Long userId;

  protected PasswordResetToken() {}

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
    return "{"
        + "\"id\":"
        + id
        + ", \"token\":\""
        + token
        + "\""
        + ", \"isUsed\":"
        + isUsed
        + ", \"userId\":\""
        + userId
        + "\""
        + "}";
  }

  public void markAsUsed() {
    this.isUsed = true;
  }
}
