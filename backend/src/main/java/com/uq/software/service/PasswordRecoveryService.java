package com.uq.software.service;

import java.time.Duration;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.exception.InvalidResetTokenException;
import com.uq.software.exception.ResetTokenNotFoundException;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;

/**
 * Lógica de recuperación de contraseña (antes vivía en el controlador).
 * Los endpoints y códigos de respuesta se mantienen; ver PasswordResetTokenController.
 */
@Service
public class PasswordRecoveryService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final String frontendBaseUrl;
    private final Duration tokenValidity;

    public PasswordRecoveryService(PasswordResetTokenRepository tokenRepository,
                                   UserRepository userRepository,
                                   EmailService emailService,
                                   PasswordEncoder passwordEncoder,
                                   @Value("${app.frontend.base-url}") String frontendBaseUrl,
                                   @Value("${app.password-reset.expiration-minutes}") long expirationMinutes) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        // Se quita la "/" final para no generar enlaces con "//"
        this.frontendBaseUrl = frontendBaseUrl.replaceAll("/+$", "");
        this.tokenValidity = Duration.ofMinutes(expirationMinutes);
    }

    /**
     * Genera un token y envía el enlace. Si el correo no existe no hace nada ni lo revela
     * (el controlador responde 200 en ambos casos).
     * El enlace usa la URL del frontend configurada, NO el header Origin (que controla el cliente
     * y permitiría enviar a la víctima un enlace hacia un sitio malicioso).
     */
    @Transactional
    public void requestReset(String email) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        userRepository.findByEmail(normalized).ifPresent(user -> {
            // Un solo enlace vigente por usuario: invalida los anteriores sin usar
            tokenRepository.findByUserId(user.getId()).stream()
                    .filter(t -> !t.getIsUsed())
                    .forEach(t -> {
                        t.markAsUsed();
                        tokenRepository.save(t);
                    });

            PasswordResetToken resetToken = new PasswordResetToken(user.getId());
            resetToken.expireAfter(tokenValidity);
            tokenRepository.save(resetToken);

            emailService.send(user.getEmail(), "Reset your password",
                    "Click here to reset your password: " + frontendBaseUrl + "/reset-password/" + resetToken.getToken());
        });
    }

    /** Cambia la contraseña (guardando solo el hash BCrypt) y marca el token como usado. */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(ResetTokenNotFoundException::new);

        if (resetToken.getIsUsed() || resetToken.isExpired()) {
            throw new InvalidResetTokenException();
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(InvalidResetTokenException::new);

        user.updatePassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.markAsUsed();
        tokenRepository.save(resetToken);
    }
}