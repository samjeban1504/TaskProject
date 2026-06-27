package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.DashboardStatsDTO;
import com.taskmanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        DashboardStatsDTO stats = dashboardService.getStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
