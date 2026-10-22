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

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PasswordResetTokenControllerTest {
  private final String endpoint = "/password-recovery";

  @Autowired private MockMvc mockMvc;

  @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;

  @Autowired private UserRepository userRepository;

  @Test
  void testResetPasswordWithToken() throws Exception {
    User user = userRepository.save(new User("user", "user1@email.com", "password"));

    PasswordResetToken resetToken =
        passwordResetTokenRepository.save(new PasswordResetToken(user.getId()));

    String body =
        """
        {
          "token": "%s",
          "newPassword": "updated_password"
        }
        """
            .formatted(resetToken.getToken());

    mockMvc
        .perform(post(endpoint).contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk());

    User updatedUser = userRepository.findById(user.getId()).orElse(null);
    assert updatedUser.getPassword().equals("updated_password");

    PasswordResetToken updatedToken =
        passwordResetTokenRepository.findByToken(resetToken.getToken()).orElse(null);
    assert updatedToken.getIsUsed();

    mockMvc
        .perform(post(endpoint).contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testGenerateToken() throws Exception {
    User user = userRepository.save(new User("user", "user2@email.com", "password"));

    String body =
        """
        {
          "email": "%s"
        }
        """
            .formatted(user.getEmail());

    mockMvc
        .perform(post(endpoint + "/reset").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk());

    User savedUser = userRepository.findByEmail(user.getEmail()).orElse(null);
    PasswordResetToken resetToken =
        passwordResetTokenRepository.findByUserId(savedUser.getId()).getFirst();
    assert resetToken != null;
    assert resetToken.getToken().length() > 0;
    assert resetToken.getIsUsed() == false;
    assert resetToken.getUserId().equals(savedUser.getId());
    assert savedUser.getPassword().equals(user.getPassword());
  }
}
