package com.banking.controller;

import com.banking.dto.ProfileResponse;
import com.banking.dto.UpdateRequest;
import com.banking.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(accountService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/update")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateRequest request) {
        return ResponseEntity.ok(accountService.updateProfile(userDetails.getUsername(), request));
    }
}
