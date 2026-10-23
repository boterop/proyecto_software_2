package com.uq.software.exception;

/** Mensaje genérico a propósito: no revela si el correo existe o si falló la contraseña. */
public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super("Credenciales inválidas");
  }
}
