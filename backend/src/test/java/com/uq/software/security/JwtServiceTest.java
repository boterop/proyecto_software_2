package com.uq.software.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

  private static final String SECRET = "clave-de-pruebas-con-mas-de-treinta-y-dos-caracteres";
  private final User user = new User("Ana", "ana@correo.com", "hash", Role.CLIENTE_EMISOR);

  @Test
  void roundTripReturnsSubject() {
    JwtService service = new JwtService(SECRET, 5);
    assertThat(service.extractValidSubject(service.generateToken(user))).contains("ana@correo.com");
  }

  @Test
  void rejectsTamperedToken() {
    JwtService service = new JwtService(SECRET, 5);
    String[] parts = service.generateToken(user).split("\\.");
    // Se cambia el payload (sub = otro usuario) conservando la firma original
    String forged = parts[0] + ".eyJzdWIiOiJoYWNrZXJAeC5jb20ifQ." + parts[2];
    assertThat(service.extractValidSubject(forged)).isEmpty();
  }

  @Test
  void rejectsTokenSignedWithOtherKey() {
    JwtService other = new JwtService("otra-clave-distinta-con-mas-de-treinta-y-dos-chars", 5);
    JwtService service = new JwtService(SECRET, 5);
    assertThat(service.extractValidSubject(other.generateToken(user))).isEmpty();
  }

  @Test
  void rejectsExpiredToken() {
    JwtService service = new JwtService(SECRET, -1);
    assertThat(service.extractValidSubject(service.generateToken(user))).isEmpty();
  }

  @Test
  void rejectsGarbage() {
    JwtService service = new JwtService(SECRET, 5);
    assertThat(service.extractValidSubject("no-es-un-jwt")).isEmpty();
  }

  @Test
  void rejectsShortSecret() {
    assertThatThrownBy(() -> new JwtService("corta", 5)).isInstanceOf(IllegalStateException.class);
  }
}
