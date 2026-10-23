package com.uq.software.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import com.uq.software.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserAdminRolesControllerTest {
  private final String endpoint = "/admin/users";

  @Autowired private MockMvc mockMvc;

  @Autowired private UserRepository userRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  @Test
  void testCreateUserHashesPasswordAndSetsRole() throws Exception {
    String body =
        """
                { "name": "Carlos Repartidor", "email": "Carlos@Email.com",
                  "password": "Segura#123", "role": "REPARTIDOR" }
                """;

    mockMvc
        .perform(post(endpoint).contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email").value("carlos@email.com"))
        .andExpect(jsonPath("$.role").value("REPARTIDOR"))
        .andExpect(jsonPath("$.password").doesNotExist());

    User saved = userRepository.findByEmail("carlos@email.com").orElseThrow();
    assertThat(saved.getPassword()).isNotEqualTo("Segura#123");
    assertThat(passwordEncoder.matches("Segura#123", saved.getPassword())).isTrue();
    assertThat(saved.getRole()).isEqualTo(Role.REPARTIDOR);
  }

  @Test
  void testCreateUserDuplicateEmail() throws Exception {
    userRepository.save(new User("Ana", "duplicado@email.com", "hash"));

    String body =
        """
                { "name": "Otra Ana", "email": "duplicado@email.com",
                  "password": "Segura#123", "role": "CLIENTE_EMISOR" }
                """;

    mockMvc
        .perform(post(endpoint).contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isConflict());
  }

  @Test
  void testCreateUserValidation() throws Exception {
    String body =
        """
                { "name": "", "email": "no-es-correo", "password": "123" }
                """;

    mockMvc
        .perform(post(endpoint).contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testChangeRole() throws Exception {
    User user = userRepository.save(new User("Ana", "rol1@email.com", "hash"));

    mockMvc
        .perform(
            put(endpoint + "/" + user.getId() + "/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"role\": \"CLIENTE_RECEPTOR\" }"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.role").value("CLIENTE_RECEPTOR"));

    assertThat(userRepository.findById(user.getId()).orElseThrow().getRole())
        .isEqualTo(Role.CLIENTE_RECEPTOR);
  }

  @Test
  void testChangeRoleInvalidValue() throws Exception {
    User user = userRepository.save(new User("Ana", "rol2@email.com", "hash"));

    mockMvc
        .perform(
            put(endpoint + "/" + user.getId() + "/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"role\": \"SUPERMAN\" }"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testChangeRoleUserNotFound() throws Exception {
    mockMvc
        .perform(
            put(endpoint + "/999999/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"role\": \"ADMIN\" }"))
        .andExpect(status().isNotFound());
  }
}
