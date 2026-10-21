package com.uq.software.controller;

import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uq.software.controller.dto.EmailRequestDTO;
import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/test")
@ConditionalOnProperty(name = "test.endpoints.enabled", havingValue = "true")
public class TestController {

  private final UserRepository userRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;

  public TestController(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
    this.userRepository = userRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }

  @GetMapping("/users/{userId}")
  public ResponseEntity<User> getUser(@PathVariable Long userId) {
    return userRepository.findById(userId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/users")
  public ResponseEntity<User> createUser(@RequestBody User user) {
    return ResponseEntity.ok(userRepository.save(user));
  }

  @DeleteMapping("/users/{userId}")
  public ResponseEntity<User> deleteUser(@PathVariable Long userId) {
    User user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    userRepository.delete(user);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/password-recovery/reset")
  public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody EmailRequestDTO request,
      HttpServletRequest httpRequest) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null) {
      return ResponseEntity.ok().build();
    }
    PasswordResetToken resetToken = new PasswordResetToken(user.getId());
    passwordResetTokenRepository.save(resetToken);

    return ResponseEntity.ok(Map.of("token", resetToken.getToken()));
  }
}
