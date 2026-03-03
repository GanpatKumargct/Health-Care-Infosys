package com.wellnest.service;

import com.wellnest.model.Activity;
import com.wellnest.model.User;
import com.wellnest.repository.ActivityRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final HabitScoreService habitScoreService;

    public Activity logActivity(Long userId, Activity activity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        activity.setUser(user);
        if (activity.getTimestamp() == null) {
            activity.setTimestamp(LocalDateTime.now());
        }
        Activity savedActivity = activityRepository.save(activity);

        // Trigger score calculation for the day
        habitScoreService.calculateDailyScore(userId, savedActivity.getTimestamp().toLocalDate());

        return savedActivity;
    }

    public List<Activity> getUserActivities(Long userId) {
        return activityRepository.findByUserId(userId);
    }
}
