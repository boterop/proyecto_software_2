package com.uq.software.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.uq.software.controller.dto.EmailRequestDTO;
import com.uq.software.controller.dto.PasswordRecoveryRequestDTO;
import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;

import jakarta.validation.Valid;

@Service
@RequestMapping("/password-recovery")
public class PasswordResetTokenController {

  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final UserRepository userRepository;

  public PasswordResetTokenController(PasswordResetTokenRepository passwordResetTokenRepository,
      UserRepository userRepository) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.userRepository = userRepository;
  }

  @PostMapping("/")
  public ResponseEntity<Void> getByToken(@Valid @RequestBody PasswordRecoveryRequestDTO request) {
    PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken()).orElse(null);

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

    user.updatePassword(request.getNewPassword());

    userRepository.save(user);
    resetToken.markAsUsed();
    passwordResetTokenRepository.save(resetToken);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/reset")
  public ResponseEntity<Void> getByEmail(@Valid @RequestBody EmailRequestDTO request) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null) {
      return ResponseEntity.ok().build();
    }
    PasswordResetToken resetToken = new PasswordResetToken(user.getId());
    passwordResetTokenRepository.save(resetToken);
    return ResponseEntity.ok().build();
  }
}
