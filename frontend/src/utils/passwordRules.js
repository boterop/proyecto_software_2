/** Debe coincidir con com.uq.software.dto.PasswordRules en el backend. */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
export const PASSWORD_MESSAGE =
  "La contraseña debe incluir mayúscula, minúscula, número y un carácter especial";

export const isPasswordValid = (password) =>
  password.length >= PASSWORD_MIN &&
  password.length <= PASSWORD_MAX &&
  PASSWORD_REGEX.test(password);
