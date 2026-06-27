package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.ProfileDTO;
import com.taskmanager.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileDTO>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProfileDTO profile = profileService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileDTO>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileDTO profileDTO
    ) {
        ProfileDTO updated = profileService.updateProfile(userDetails.getUsername(), profileDTO);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
