package com.uq.software.controller;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uq.software.controller.dto.EmailRequestDTO;
import com.uq.software.controller.dto.PasswordRecoveryRequestDTO;
import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;
import com.uq.software.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/password-recovery")
public class PasswordResetTokenController {

  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final UserRepository userRepository;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;

  public PasswordResetTokenController(PasswordResetTokenRepository passwordResetTokenRepository,
      UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping
  public ResponseEntity<Void> updatePassword(
      @Valid @RequestBody PasswordRecoveryRequestDTO request) {
    PasswordResetToken resetToken =
        passwordResetTokenRepository.findByToken(request.getToken()).orElse(null);

    if (resetToken == null) {
      return ResponseEntity.notFound().build();
    }

    if (resetToken.getIsUsed()) {
      return ResponseEntity.badRequest().build();
    }

    User user = userRepository.findById(resetToken.getUserId()).orElse(null);
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }

    user.updatePassword(
            request.getNewPassword(),
            passwordEncoder);

    userRepository.save(user);
    resetToken.markAsUsed();
    passwordResetTokenRepository.save(resetToken);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/reset")
  public ResponseEntity<Void> reset(
      @Valid @RequestBody EmailRequestDTO request, HttpServletRequest httpRequest) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null) {
      return ResponseEntity.ok().build();
    }
    PasswordResetToken resetToken = new PasswordResetToken(user.getId());
    passwordResetTokenRepository.save(resetToken);

    String domain = httpRequest.getHeader("Origin");
    String page = "/reset-password/";

    emailService.send(
        user.getEmail(),
        "Reset your password",
        "Click here to reset your password: " + domain + page + resetToken.getToken());

    return ResponseEntity.ok().build();
  }
}
