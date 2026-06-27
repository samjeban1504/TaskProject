package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskDTO>>> getTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dueDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<TaskDTO> tasks = taskService.getTasks(
                userDetails.getUsername(), search, priority, status, dueDate, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDTO>> getTaskById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        TaskDTO task = taskService.getTaskById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", task));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        TaskDTO created = taskService.createTask(userDetails.getUsername(), taskDTO);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        TaskDTO updated = taskService.updateTask(userDetails.getUsername(), id, taskDTO);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        taskService.deleteTask(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
