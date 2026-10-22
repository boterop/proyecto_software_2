package com.uq.software.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PasswordResetTokenControllerTest {

  private final String endpoint = "/password-recovery";

  @Autowired private MockMvc mockMvc;

  @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;

  @Autowired private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Test
  void testResetPasswordWithToken() throws Exception {
    String originalPassword = "original_password";
    User user = userRepository.save(
            new User(
                    "user",
                    "user1@email.com",
                    passwordEncoder.encode(originalPassword)
            )
    );

    PasswordResetToken resetToken =
            passwordResetTokenRepository.save(
                    new PasswordResetToken(user.getId())
            );

    String newPassword = "updated_password";

    String body = """
            {
              "token": "%s",
              "newPassword": "%s"
            }
            """.formatted(resetToken.getToken(), newPassword);

    mockMvc.perform(post(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body))
            .andExpect(status().isOk());

    User updatedUser = userRepository.findById(user.getId())
            .orElseThrow();

    assertNotEquals(newPassword, updatedUser.getPassword());
    assertTrue(
            passwordEncoder.matches(
                    newPassword,
                    updatedUser.getPassword()
            )
    );
    assertFalse(
            passwordEncoder.matches(
                    originalPassword,
                    updatedUser.getPassword()
            )
    );

    PasswordResetToken updatedToken =
            passwordResetTokenRepository
                    .findByToken(resetToken.getToken())
                    .orElseThrow();

    assertTrue(updatedToken.getIsUsed());

    mockMvc.perform(post(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body))
            .andExpect(status().isBadRequest());
  }

  @Test
  void testGenerateToken() throws Exception {
    String originalPassword = "password";

    User user = userRepository.save(
            new User(
                    "user",
                    "user2@email.com",
                    passwordEncoder.encode(originalPassword)
            )
    );

    String body = """
            {
              "email": "%s"
            }
            """.formatted(user.getEmail());

    mockMvc.perform(post(endpoint + "/reset")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body))
            .andExpect(status().isOk());

    User savedUser = userRepository.findByEmail(user.getEmail())
            .orElseThrow();

    PasswordResetToken resetToken =
            passwordResetTokenRepository
                    .findByUserId(savedUser.getId())
                    .stream()
                    .findFirst()
                    .orElseThrow();

    assertNotNull(resetToken.getToken());
    assertFalse(resetToken.getToken().isBlank());
    assertFalse(resetToken.getIsUsed());
    assertEquals(savedUser.getId(), resetToken.getUserId());

    // Solicitar recuperación no debe cambiar la contraseña.
    assertTrue(
            passwordEncoder.matches(
                    originalPassword,
                    savedUser.getPassword()
            )
    );
  }
}