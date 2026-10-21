package com.uq.software.dto;

/** Regla única de contraseña, compartida por registro y recuperación de contraseña. */
public final class PasswordRules {

    public static final String REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$";
    public static final String MESSAGE =
            "La contraseña debe incluir mayúscula, minúscula, número y un carácter especial";
    public static final int MIN = 8;
    // BCrypt solo usa los primeros 72 bytes
    public static final int MAX = 72;

    private PasswordRules() {
    }
}
