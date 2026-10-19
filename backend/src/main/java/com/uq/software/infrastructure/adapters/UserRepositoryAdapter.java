package com.uq.software.infrastructure.adapters;

import com.uq.software.domain.User;
import com.uq.software.domain.UserRepository;
import com.uq.software.infrastructure.persistence.UserEntity;
import com.uq.software.infrastructure.persistence.UserJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepository {

  private final UserJpaRepository repository;

  public UserRepositoryAdapter(UserJpaRepository repository) {
    this.repository = repository;
  }

  @Override
  public User save(User user) {
    UserEntity entity = new UserEntity(user);
    UserEntity savedEntity = repository.save(entity);

    return savedEntity.toDomain();
  }

  @Override
  public Optional<User> findById(Long id) {
    return repository.findById(id)
        .map(UserEntity::toDomain);
  }
}
