package com.uq.software.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false, unique = true)
  private Long userId;

  private String phone;
  private String address;
  private String city;

  protected UserProfile() {}

  public UserProfile(Long userId) {
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public Long getUserId() {
    return userId;
  }

  public String getPhone() {
    return phone;
  }

  public String getAddress() {
    return address;
  }

  public String getCity() {
    return city;
  }

  public void update(String phone, String address, String city) {
    this.phone = phone;
    this.address = address;
    this.city = city;
  }
}
