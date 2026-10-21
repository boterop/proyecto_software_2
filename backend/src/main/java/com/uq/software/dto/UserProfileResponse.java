package com.uq.software.dto;

/** Perfil del usuario. Nunca incluye la contraseña. */
public record UserProfileResponse(Long userId, String name, String email, String phone, String address,
                                  String city) {
}