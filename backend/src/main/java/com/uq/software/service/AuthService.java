package com.uq.software.service;

import com.uq.software.dto.AuthResponse;
import com.uq.software.dto.LoginRequest;
import com.uq.software.dto.RegisterRequest;
import com.uq.software.dto.UserResponse;
import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import com.uq.software.exception.EmailAlreadyExistsException;
import com.uq.software.exception.InvalidCredentialsException;
import com.uq.software.repository.UserRepository;
import com.uq.software.security.JwtService;
import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  /** Hash de relleno para igualar el tiempo de respuesta cuando el correo no existe. */
  private final String dummyHash;

  public AuthService(
      UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.dummyHash = passwordEncoder.encode("dummy-password-for-timing");
  }

  @Transactional
  public UserResponse register(RegisterRequest request) {
    String email = normalize(request.email());
    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyExistsException();
    }
    User user =
        new User(
            request.name().trim(),
            email,
            passwordEncoder.encode(request.password()),
            Role.CLIENTE_EMISOR);
    try {
      return UserResponse.from(userRepository.saveAndFlush(user));
    } catch (DataIntegrityViolationException e) {
      // Dos registros simultáneos con el mismo correo: gana la restricción UNIQUE de la BD.
      throw new EmailAlreadyExistsException();
    }
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    String email = normalize(request.email());
    User user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
      passwordEncoder.matches(request.password(), dummyHash);
      throw new InvalidCredentialsException();
    }
    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new InvalidCredentialsException();
    }
    return AuthResponse.bearer(
        jwtService.generateToken(user), jwtService.getExpirationSeconds(), UserResponse.from(user));
  }

  private static String normalize(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }
}
