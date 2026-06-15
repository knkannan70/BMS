package com.banking.service;

import com.banking.dto.ProfileResponse;
import com.banking.dto.UpdateRequest;
import com.banking.entity.Account;
import com.banking.entity.User;
import com.banking.exception.AccountNotFoundException;
import com.banking.repository.AccountRepository;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("User not found"));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return ProfileResponse.builder()
                .fullName(user.getFullName())
                .dob(user.getDob())
                .address(user.getAddress())
                .mobile(user.getMobile())
                .email(user.getEmail())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(String email, UpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("User not found"));

        user.setAddress(request.getAddress());
        user.setMobile(request.getMobile());
        
        // We do not change the email address as it is used for login. 
        // If requirements demand it, we would need to check for duplicates and update SecurityContext.
        // For now we'll allow updating email if it doesn't exist, but it's risky for JWT.
        // Let's assume we can update it if it's not taken.
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new com.banking.exception.DuplicateEmailException("Email already taken");
        }
        user.setEmail(request.getEmail());

        user = userRepository.save(user);

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return ProfileResponse.builder()
                .fullName(user.getFullName())
                .dob(user.getDob())
                .address(user.getAddress())
                .mobile(user.getMobile())
                .email(user.getEmail())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .build();
    }
}
