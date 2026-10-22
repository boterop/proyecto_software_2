package com.uq.software.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.uq.software.entity.PasswordResetToken;
import com.uq.software.entity.User;
import com.uq.software.entity.UserProfile;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserProfileRepository;
import com.uq.software.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserAdminControllerTest {
  private final String endpoint = "/admin/users";

  @Autowired private MockMvc mockMvc;

  @Autowired private UserRepository userRepository;

  @Autowired private UserProfileRepository userProfileRepository;

  @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;

  @Test
  void testListUsersHidesPassword() throws Exception {
    userRepository.save(new User("Ana", "admin-list@email.com", "secret"));

    mockMvc
        .perform(get(endpoint))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.email == 'admin-list@email.com')]").exists())
        .andExpect(jsonPath("$[0].password").doesNotExist());
  }

  @Test
  void testGetUser() throws Exception {
    User user = userRepository.save(new User("Ana", "admin-get@email.com", "secret"));

    mockMvc
        .perform(get(endpoint + "/" + user.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Ana"))
        .andExpect(jsonPath("$.email").value("admin-get@email.com"))
        .andExpect(jsonPath("$.password").doesNotExist());
  }

  @Test
  void testGetUserNotFound() throws Exception {
    mockMvc.perform(get(endpoint + "/999999")).andExpect(status().isNotFound());
  }

  @Test
  void testDeleteUserAlsoDeletesProfileAndTokens() throws Exception {
    User user = userRepository.save(new User("Ana", "admin-delete@email.com", "secret"));
    UserProfile profile = new UserProfile(user.getId());
    profile.update("3001234567", "Calle 1", "Armenia");
    userProfileRepository.save(profile);
    passwordResetTokenRepository.save(new PasswordResetToken(user.getId()));

    mockMvc.perform(delete(endpoint + "/" + user.getId())).andExpect(status().isNoContent());

    assert userRepository.findById(user.getId()).isEmpty();
    assert userProfileRepository.findByUserId(user.getId()).isEmpty();
    assert passwordResetTokenRepository.findByUserId(user.getId()).isEmpty();

    mockMvc.perform(get(endpoint + "/" + user.getId())).andExpect(status().isNotFound());
  }

  @Test
  void testDeleteUserNotFound() throws Exception {
    mockMvc.perform(delete(endpoint + "/999999")).andExpect(status().isNotFound());
  }
}
