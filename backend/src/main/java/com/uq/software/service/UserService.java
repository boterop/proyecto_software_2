package com.uq.software.service;

import com.uq.software.dto.UserResponse;
import com.uq.software.entity.User;
import com.uq.software.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User create(User user) {
    return userRepository.save(user);
  }

  public List<User> findAll() {
    return userRepository.findAll();
  }

  public Optional<User> getById(Long id) {
    return userRepository.findById(id);
  }

  public Optional<User> getByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  public UserResponse toResponse(User user) {
    return UserResponse.from(user);
  }
}
