package com.uq.software.dto;

import com.uq.software.entity.Role;
import com.uq.software.entity.User;

/** Vista pública del usuario: nunca incluye la contraseña ni su hash. */
public record UserResponse(Long id, String name, String email, Role role) {

  public static UserResponse from(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
  }
}
