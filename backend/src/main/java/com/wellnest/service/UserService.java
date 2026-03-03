package com.wellnest.service;

import com.wellnest.dto.UserProfileDto;
import com.wellnest.model.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileDto getUserProfile() {
        User user = getCurrentUser();
        return UserProfileDto.builder()
                .fullName(user.getFullName())
                .age(user.getAge())
                .height(user.getHeight())
                .weight(user.getWeight())
                .fitnessGoal(user.getFitnessGoal())
                .activityLevel(user.getActivityLevel())
                .profileCompletionPercentage(user.getProfileCompletionPercentage())
                .build();
    }

    public UserProfileDto updateProfile(UserProfileDto profileDto) {
        User user = getCurrentUser();

        user.setFullName(profileDto.getFullName());
        user.setAge(profileDto.getAge());
        user.setHeight(profileDto.getHeight());
        user.setWeight(profileDto.getWeight());
        user.setFitnessGoal(profileDto.getFitnessGoal());
        user.setActivityLevel(profileDto.getActivityLevel());

        user.calculateProfileCompletion();
        userRepository.save(user);

        return getUserProfile();
    }
}
