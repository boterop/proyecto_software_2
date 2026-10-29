package com.uq.software.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AssignCourierRequest(
        @NotNull(message = "El id del repartidor es obligatorio") Long courierId,
        @Size(max = 200, message = "El motivo no puede pasar de 200 caracteres") String reason) {}