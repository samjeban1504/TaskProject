package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Page<TaskDTO> getTasks(String email, String search, String priority, String status,
                                   String dueDate, int page, int size, String sortBy, String sortDir) {
        User user = getUserByEmail(email);

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Task.Priority priorityEnum = priority != null && !priority.isEmpty()
                ? Task.Priority.valueOf(priority.toUpperCase()) : null;

        Task.Status statusEnum = status != null && !status.isEmpty()
                ? Task.Status.valueOf(status.toUpperCase()) : null;

        LocalDate dueDateLocal = dueDate != null && !dueDate.isEmpty()
                ? LocalDate.parse(dueDate) : null;

        return taskRepository
                .findByUserIdWithFilters(user.getId(), search, priorityEnum, statusEnum, dueDateLocal, pageable)
                .map(this::toDTO);
    }

    public TaskDTO getTaskById(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return toDTO(task);
    }

    public TaskDTO createTask(String email, TaskDTO taskDTO) {
        User user = getUserByEmail(email);

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .priority(taskDTO.getPriority() != null ? taskDTO.getPriority() : Task.Priority.MEDIUM)
                .status(taskDTO.getStatus() != null ? taskDTO.getStatus() : Task.Status.PENDING)
                .dueDate(taskDTO.getDueDate())
                .user(user)
                .build();

        return toDTO(taskRepository.save(task));
    }

    public TaskDTO updateTask(String email, Long taskId, TaskDTO taskDTO) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        if (taskDTO.getPriority() != null) task.setPriority(taskDTO.getPriority());
        if (taskDTO.getStatus() != null) task.setStatus(taskDTO.getStatus());
        task.setDueDate(taskDTO.getDueDate());

        return toDTO(taskRepository.save(task));
    }

    public void deleteTask(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private TaskDTO toDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .userId(task.getUser().getId())
                .build();
    }
}
