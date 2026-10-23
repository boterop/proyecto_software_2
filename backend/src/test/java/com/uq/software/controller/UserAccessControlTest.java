package com.uq.software.controller;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import com.uq.software.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

/** HU-02: control de acceso por rol. Activa la seguridad real (en los demás tests está abierta). */
@SpringBootTest(properties = "app.test.security.permit-all=false")
@Transactional
class UserAccessControlTest {

    @Autowired private WebApplicationContext context;

    @Autowired private UserRepository userRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void testProfileRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/user-profiles/1")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "dueno@email.com")
    void testOwnerCanReadAndUpdateOwnProfile() throws Exception {
        User user = userRepository.save(new User("Ana", "dueno@email.com", "hash"));

        mockMvc.perform(get("/user-profiles/" + user.getId())).andExpect(status().isOk());

        mockMvc
                .perform(
                        put("/user-profiles/" + user.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"city\": \"Armenia\" }"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "intruso@email.com")
    void testUserCannotAccessAnotherProfile() throws Exception {
        User other = userRepository.save(new User("Ana", "ajena@email.com", "hash"));

        mockMvc.perform(get("/user-profiles/" + other.getId())).andExpect(status().isForbidden());

        mockMvc
                .perform(
                        put("/user-profiles/" + other.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"city\": \"Armenia\" }"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@email.com", roles = "ADMIN")
    void testAdminCanAccessAnyProfile() throws Exception {
        User other = userRepository.save(new User("Ana", "otra@email.com", "hash"));

        mockMvc.perform(get("/user-profiles/" + other.getId())).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "cliente@email.com", roles = "CLIENTE_EMISOR")
    void testNonAdminCannotUseAdminEndpoints() throws Exception {
        User other = userRepository.save(new User("Ana", "victima@email.com", "hash"));

        mockMvc.perform(get("/admin/users")).andExpect(status().isForbidden());
        mockMvc.perform(delete("/admin/users/" + other.getId())).andExpect(status().isForbidden());
        mockMvc
                .perform(
                        put("/admin/users/" + other.getId() + "/role")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"role\": \"ADMIN\" }"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@email.com", roles = "ADMIN")
    void testAdminCanListUsers() throws Exception {
        mockMvc.perform(get("/admin/users")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin-self@email.com", roles = "ADMIN")
    void testAdminCannotChangeOwnRoleNorDeleteSelf() throws Exception {
        User admin = userRepository.save(new User("Admin", "admin-self@email.com", "hash", Role.ADMIN));

        mockMvc
                .perform(
                        put("/admin/users/" + admin.getId() + "/role")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"role\": \"CLIENTE_EMISOR\" }"))
                .andExpect(status().isConflict());

        mockMvc.perform(delete("/admin/users/" + admin.getId())).andExpect(status().isConflict());
    }
}