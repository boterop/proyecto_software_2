package com.uq.software.dto;

import com.uq.software.entity.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull(message = "El rol es obligatorio") Role role) {}
