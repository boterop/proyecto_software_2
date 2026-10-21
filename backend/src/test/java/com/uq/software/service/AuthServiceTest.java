package com.uq.software.service;

import com.uq.software.dto.AuthResponse;
import com.uq.software.dto.LoginRequest;
import com.uq.software.dto.RegisterRequest;
import com.uq.software.dto.UserResponse;
import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import com.uq.software.exception.EmailAlreadyExistsException;
import com.uq.software.exception.InvalidCredentialsException;
import com.uq.software.repository.UserRepository;
import com.uq.software.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4); // costo bajo: solo para pruebas
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService("clave-de-pruebas-con-mas-de-treinta-y-dos-caracteres", 5);
        authService = new AuthService(userRepository, encoder, jwtService);
    }

    @Test
    void registerHashesPasswordNormalizesEmailAndForcesClientRole() {
        when(userRepository.existsByEmail("ana@correo.com")).thenReturn(false);
        when(userRepository.saveAndFlush(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserResponse response = authService.register(
                new RegisterRequest("  Ana Pérez ", "  Ana@Correo.COM ", "Clave#1234"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).saveAndFlush(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getPassword()).isNotEqualTo("Clave#1234");
        assertThat(encoder.matches("Clave#1234", saved.getPassword())).isTrue();
        assertThat(saved.getEmail()).isEqualTo("ana@correo.com");
        assertThat(saved.getName()).isEqualTo("Ana Pérez");
        assertThat(saved.getRole()).isEqualTo(Role.CLIENTE_EMISOR);
        assertThat(response.email()).isEqualTo("ana@correo.com");
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("ana@correo.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("Ana", "ana@correo.com", "Clave#1234")))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).saveAndFlush(any());
    }

    @Test
    void registerMapsUniqueConstraintRaceToEmailAlreadyExists() {
        when(userRepository.existsByEmail("ana@correo.com")).thenReturn(false);
        when(userRepository.saveAndFlush(any(User.class))).thenThrow(new DataIntegrityViolationException("unique"));

        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("Ana", "ana@correo.com", "Clave#1234")))
                .isInstanceOf(EmailAlreadyExistsException.class);
    }

    @Test
    void loginReturnsValidTokenForCorrectCredentials() {
        User user = new User("Ana", "ana@correo.com", encoder.encode("Clave#1234"), Role.CLIENTE_EMISOR);
        when(userRepository.findByEmail("ana@correo.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(new LoginRequest("ANA@correo.com", "Clave#1234"));

        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.expiresInSeconds()).isEqualTo(300);
        assertThat(jwtService.extractValidSubject(response.token())).contains("ana@correo.com");
    }

    @Test
    void loginFailsWithWrongPassword() {
        User user = new User("Ana", "ana@correo.com", encoder.encode("Clave#1234"), Role.CLIENTE_EMISOR);
        when(userRepository.findByEmail("ana@correo.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("ana@correo.com", "Otra#9999")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void loginFailsWithUnknownEmailUsingSameException() {
        when(userRepository.findByEmail("nadie@correo.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("nadie@correo.com", "Clave#1234")))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Credenciales inválidas");
    }
}
