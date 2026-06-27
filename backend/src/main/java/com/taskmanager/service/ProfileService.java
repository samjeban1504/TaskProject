package com.taskmanager.service;

import com.taskmanager.dto.ProfileDTO;
import com.taskmanager.entity.User;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileDTO getProfile(String email) {
        User user = getUserByEmail(email);
        return ProfileDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public ProfileDTO updateProfile(String email, ProfileDTO profileDTO) {
        User user = getUserByEmail(email);

        user.setFullName(profileDTO.getFullName());

        // Handle password change
        if (profileDTO.getCurrentPassword() != null && !profileDTO.getCurrentPassword().isEmpty()) {
            if (!passwordEncoder.matches(profileDTO.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            if (profileDTO.getNewPassword() == null || profileDTO.getNewPassword().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(profileDTO.getNewPassword()));
        }

        userRepository.save(user);

        return ProfileDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
