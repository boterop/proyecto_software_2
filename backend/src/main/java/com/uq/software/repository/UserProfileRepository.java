package com.uq.software.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uq.software.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);
}