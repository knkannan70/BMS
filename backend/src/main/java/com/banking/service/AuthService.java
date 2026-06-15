package com.banking.service;

import com.banking.dto.AuthResponse;
import com.banking.dto.LoginRequest;
import com.banking.dto.RegisterRequest;
import com.banking.entity.Account;
import com.banking.entity.AccountStatus;
import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.exception.AuthenticationException;
import com.banking.exception.DuplicateEmailException;
import com.banking.repository.AccountRepository;
import com.banking.repository.UserRepository;
import com.banking.security.CustomUserDetails;
import com.banking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final TransactionService transactionService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .dob(request.getDob())
                .address(request.getAddress())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .build();

        user = userRepository.save(user);

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .user(user)
                .build();

        accountRepository.save(account);

        // Perform initial deposit if greater than 0
        if (request.getInitialDeposit() != null && request.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            transactionService.deposit(accountNumber, request.getInitialDeposit(), "Initial Deposit");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .accountNumber(accountNumber)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new AuthenticationException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("User not found"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        String accountNumber = account != null ? account.getAccountNumber() : null;

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .accountNumber(accountNumber)
                .build();
    }

    private String generateUniqueAccountNumber() {
        Random random = new Random();
        String accountNumber;
        do {
            long number = (long) (Math.random() * 10000000000L); // 10 digit
            accountNumber = String.format("%010d", number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
