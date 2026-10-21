package com.uq.software.dto;

import com.uq.software.entity.User;

/** Vista de administración del usuario. Nunca incluye la contraseña. */
public record UserSummaryResponse(Long id, String name, String email) {

    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(user.getId(), user.getName(), user.getEmail());
    }
}