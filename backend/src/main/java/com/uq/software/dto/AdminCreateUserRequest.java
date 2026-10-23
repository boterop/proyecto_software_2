package com.uq.software.dto;

import com.uq.software.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Creación de un usuario por el administrador: a diferencia del registro público, incluye el rol. */
public record AdminCreateUserRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        @Pattern(
                regexp = "^[\\p{L}\\p{M}][\\p{L}\\p{M} .'-]*$",
                message =
                        "El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones")
        String name,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        @Size(max = 254, message = "El correo es demasiado largo")
        String email,
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(
                min = PasswordRules.MIN,
                max = PasswordRules.MAX,
                message = "La contraseña debe tener entre 8 y 72 caracteres")
        @Pattern(regexp = PasswordRules.REGEX, message = PasswordRules.MESSAGE)
        String password,
        @NotNull(message = "El rol es obligatorio") Role role) {}