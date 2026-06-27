package com.taskmanager.service;

import com.taskmanager.dto.DashboardStatsDTO;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardStatsDTO getStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        long total = taskRepository.countByUserId(user.getId());
        long completed = taskRepository.countByUserIdAndStatus(user.getId(), Task.Status.COMPLETED);
        long pending = taskRepository.countByUserIdAndStatus(user.getId(), Task.Status.PENDING);
        long inProgress = taskRepository.countByUserIdAndStatus(user.getId(), Task.Status.IN_PROGRESS);
        long highPriority = taskRepository.countByUserIdAndPriority(user.getId(), Task.Priority.HIGH);
        long mediumPriority = taskRepository.countByUserIdAndPriority(user.getId(), Task.Priority.MEDIUM);
        long lowPriority = taskRepository.countByUserIdAndPriority(user.getId(), Task.Priority.LOW);

        double completionPercentage = total > 0 ? (double) completed / total * 100 : 0;

        return DashboardStatsDTO.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .highPriorityTasks(highPriority)
                .mediumPriorityTasks(mediumPriority)
                .lowPriorityTasks(lowPriority)
                .completionPercentage(Math.round(completionPercentage * 10.0) / 10.0)
                .build();
    }
}
