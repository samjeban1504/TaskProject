package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long highPriorityTasks;
    private long mediumPriorityTasks;
    private long lowPriorityTasks;
    private double completionPercentage;
}
