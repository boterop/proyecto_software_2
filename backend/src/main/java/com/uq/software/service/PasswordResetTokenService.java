package com.uq.software.service;

import org.springframework.stereotype.Service;

import com.uq.software.entity.PasswordResetToken;
import com.uq.software.repository.PasswordResetTokenRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PasswordResetTokenService {

  private final PasswordResetTokenRepository passwordResetTokenRepository;

  public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }

  public PasswordResetToken create(String token, Long userId) {
    return passwordResetTokenRepository.save(new PasswordResetToken(token, userId));
  }

  public Optional<PasswordResetToken> getByToken(String token) {
    return passwordResetTokenRepository.findByToken(token);
  }

  public List<PasswordResetToken> getByUserId(Long userId) {
    return passwordResetTokenRepository.findByUserId(userId);
  }
}
