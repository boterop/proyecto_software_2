package com.uq.software.repository;

import com.uq.software.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  // HU-01 (nuevo)
  boolean existsByEmail(String email);
}
