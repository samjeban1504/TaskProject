package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUserId(Long userId, Pageable pageable);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, Task.Status status);

    long countByUserIdAndPriority(Long userId, Task.Priority priority);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:dueDate IS NULL OR t.dueDate = :dueDate)")
    Page<Task> findByUserIdWithFilters(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("priority") Task.Priority priority,
            @Param("status") Task.Status status,
            @Param("dueDate") LocalDate dueDate,
            Pageable pageable
    );
}
