package com.uq.software.service;

import com.uq.software.dto.UserProfileRequest;
import com.uq.software.dto.UserProfileResponse;
import com.uq.software.entity.User;
import com.uq.software.entity.UserProfile;
import com.uq.software.repository.UserProfileRepository;
import com.uq.software.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

  private final UserProfileRepository userProfileRepository;
  private final UserRepository userRepository;

  public UserProfileService(
      UserProfileRepository userProfileRepository, UserRepository userRepository) {
    this.userProfileRepository = userProfileRepository;
    this.userRepository = userRepository;
  }

  /** Empty si el usuario no existe. Si aún no tiene perfil, devuelve los campos vacíos. */
  public Optional<UserProfileResponse> get(Long userId) {
    return userRepository
        .findById(userId)
        .map(user -> toResponse(user, userProfileRepository.findByUserId(userId).orElse(null)));
  }

  /** Crea o actualiza el perfil. Empty si el usuario no existe. */
  public Optional<UserProfileResponse> save(Long userId, UserProfileRequest request) {
    return userRepository
        .findById(userId)
        .map(
            user -> {
              UserProfile profile =
                  userProfileRepository
                      .findByUserId(userId)
                      .orElseGet(() -> new UserProfile(userId));
              profile.update(request.phone(), request.address(), request.city());
              return toResponse(user, userProfileRepository.save(profile));
            });
  }

  /** true si el usuario {userId} es el dueño del correo indicado. */
  public boolean isOwner(Long userId, String email) {
    return userRepository.findById(userId).map(u -> u.getEmail().equals(email)).orElse(false);
  }

  private UserProfileResponse toResponse(User user, UserProfile profile) {
    return new UserProfileResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        profile == null ? null : profile.getPhone(),
        profile == null ? null : profile.getAddress(),
        profile == null ? null : profile.getCity());
  }
}
