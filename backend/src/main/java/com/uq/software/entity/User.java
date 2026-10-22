package com.uq.software.entity;

import jakarta.persistence.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String password; // HU-01: guarda SIEMPRE el hash BCrypt, nunca texto plano

  // HU-01 (nuevo): rol para RBAC. El default en la columna permite que
  // "ddl-auto=update"
  // agregue la columna a una BD SQLite que ya tenga usuarios.
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, columnDefinition = "varchar(20) not null default 'CLIENTE_EMISOR'")
  private Role role = Role.CLIENTE_EMISOR;

  protected User() {}

  // Constructor original: se mantiene para no romper el código ni los tests
  // existentes.
  public User(String name, String email, String password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // HU-01 (nuevo)
  public User(String name, String email, String password, Role role) {
    this(name, email, password);
    this.role = role;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public Role getRole() {
    return role;
  }

  public void updatePassword(String newPassword, PasswordEncoder passwordEncoder) {
    if (newPassword == null || newPassword.isBlank()) {
      throw new IllegalArgumentException("La nueva contraseña no puede estar vacía");
    }

    if (passwordEncoder == null) {
      throw new IllegalArgumentException("PasswordEncoder no puede ser null");
    }

    this.password = passwordEncoder.encode(newPassword);
  }
}
