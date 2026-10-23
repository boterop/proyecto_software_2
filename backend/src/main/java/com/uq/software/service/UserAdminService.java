package com.uq.software.service;

import com.uq.software.entity.Role;
import com.uq.software.entity.User;
import com.uq.software.exception.EmailAlreadyExistsException;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserProfileRepository;
import com.uq.software.repository.UserRepository;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAdminService {

  private final UserRepository userRepository;
  private final UserProfileRepository userProfileRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final PasswordEncoder passwordEncoder;

  public UserAdminService(
      UserRepository userRepository,
      UserProfileRepository userProfileRepository,
      PasswordResetTokenRepository passwordResetTokenRepository,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.userProfileRepository = userProfileRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<User> getAll() {
    return userRepository.findAll();
  }

  public Optional<User> getById(Long id) {
    return userRepository.findById(id);
  }

  /** Crea un usuario con la contraseña cifrada y el rol indicado. */
  public User create(String name, String email, String password, Role role) {
    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
    if (userRepository.existsByEmail(normalizedEmail)) {
      throw new EmailAlreadyExistsException();
    }
    try {
      return userRepository.saveAndFlush(
          new User(name.trim(), normalizedEmail, passwordEncoder.encode(password), role));
    } catch (DataIntegrityViolationException e) {
      throw new EmailAlreadyExistsException();
    }
  }

  /** Cambia el rol del usuario. Empty si el usuario no existe. */
  @Transactional
  public Optional<User> changeRole(Long id, Role role) {
    return userRepository
        .findById(id)
        .map(
            user -> {
              user.changeRole(role);
              return userRepository.save(user);
            });
  }

  /** true si el usuario {id} es el dueño del correo indicado. */
  public boolean isSameUser(Long id, String email) {
    return userRepository.findById(id).map(user -> user.getEmail().equals(email)).orElse(false);
  }

  /** Elimina el usuario junto con su perfil y sus tokens de recuperación. false si no existe. */
  @Transactional
  public boolean delete(Long id) {
    Optional<User> user = userRepository.findById(id);
    if (user.isEmpty()) {
      return false;
    }
    userProfileRepository.findByUserId(id).ifPresent(userProfileRepository::delete);
    passwordResetTokenRepository.deleteAll(passwordResetTokenRepository.findByUserId(id));
    userRepository.delete(user.get());
    return true;
  }
}
