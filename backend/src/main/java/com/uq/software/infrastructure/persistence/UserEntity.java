package com.uq.software.infrastructure.persistence;

import com.uq.software.domain.User;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;
  private String email;
  private String password;

  protected UserEntity() {
  }

  public UserEntity(User user) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmail();
    this.password = user.getPassword();
  }

  public User toDomain() {
    return new User(id, name, email, password);
  }
}
