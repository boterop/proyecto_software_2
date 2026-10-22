package com.uq.software.controller;

import com.uq.software.dto.AuthResponse;
import com.uq.software.dto.LoginRequest;
import com.uq.software.dto.RegisterRequest;
import com.uq.software.dto.UserResponse;
import com.uq.software.repository.UserRepository;
import com.uq.software.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * URLs reales (con context-path): POST /api/auth/register, POST
 * /api/auth/login, GET /api/auth/me
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final UserRepository userRepository;

  public AuthController(AuthService authService, UserRepository userRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
  }

  private void addTokenInCookie(HttpServletResponse response, String token) {
    Cookie cookie = new Cookie("access_token", token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(60 * 60 * 24);

    response.addCookie(cookie);
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request,
      HttpServletResponse response) {
    String token = authService.register(request).token().toString();
    addTokenInCookie(response, token);

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", token));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request,
      HttpServletResponse response) {
    String token = authService.login(request).token().toString();
    addTokenInCookie(response, token);

    return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token));
  }

  /** Devuelve el usuario autenticado; útil para que el SPA restaure la sesión. */
  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(Authentication authentication) {
    return userRepository
        .findByEmail(authentication.getName())
        .map(UserResponse::from)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }
}
