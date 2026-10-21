package com.uq.software.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.uq.software.entity.User;
import com.uq.software.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserProfileControllerTest {
    private final String endpoint = "/user-profiles/";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testGetProfileWithoutDataYetHidesPassword() throws Exception {
        User user = userRepository.save(new User("Ana", "profile1@email.com", "secret"));

        mockMvc.perform(get(endpoint + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ana"))
                .andExpect(jsonPath("$.email").value("profile1@email.com"))
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void testGetProfileUserNotFound() throws Exception {
        mockMvc.perform(get(endpoint + "999999")).andExpect(status().isNotFound());
    }

    @Test
    void testCreateAndUpdateProfile() throws Exception {
        User user = userRepository.save(new User("Ana", "profile2@email.com", "secret"));

        String body = """
        { "phone": "3001234567", "address": "Calle 1 # 2-3", "city": "Armenia" }
        """;

        mockMvc.perform(put(endpoint + user.getId()).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("3001234567"))
                .andExpect(jsonPath("$.city").value("Armenia"));

        String update = """
        { "phone": "3109876543", "address": "Carrera 4 # 5-6", "city": "Calarcá" }
        """;

        mockMvc.perform(put(endpoint + user.getId()).contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Calarcá"));

        mockMvc.perform(get(endpoint + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("3109876543"));
    }

    @Test
    void testSaveProfileValidation() throws Exception {
        User user = userRepository.save(new User("Ana", "profile3@email.com", "secret"));

        mockMvc.perform(put(endpoint + user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"phone\": \"abc\" }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSaveProfileUserNotFound() throws Exception {
        mockMvc.perform(put(endpoint + "999999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"city\": \"Armenia\" }"))
                .andExpect(status().isNotFound());
    }
}