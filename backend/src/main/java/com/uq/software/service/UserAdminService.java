package com.uq.software.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uq.software.entity.User;
import com.uq.software.repository.PasswordResetTokenRepository;
import com.uq.software.repository.UserProfileRepository;
import com.uq.software.repository.UserRepository;

@Service
public class UserAdminService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public UserAdminService(UserRepository userRepository, UserProfileRepository userProfileRepository,
                            PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
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