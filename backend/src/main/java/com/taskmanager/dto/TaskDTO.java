package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Task.Priority priority;

    private Task.Status status;

    private LocalDate dueDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long userId;
}
