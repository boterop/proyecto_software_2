package com.uq.software.repository;

import com.uq.software.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  List<User> findAll();

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);
}
