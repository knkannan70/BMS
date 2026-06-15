package com.banking.service;

import com.banking.dto.AuthResponse;
import com.banking.dto.RegisterRequest;
import com.banking.entity.User;
import com.banking.exception.DuplicateEmailException;
import com.banking.repository.AccountRepository;
import com.banking.repository.UserRepository;
import com.banking.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "John Doe", LocalDate.of(1990, 1, 1), "123 Main St", 
                "1234567890", "john@test.com", "password", BigDecimal.ZERO
        );

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(accountRepository.existsByAccountNumber(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("john@test.com", response.getEmail());
        verify(accountRepository, times(1)).save(any());
    }

    @Test
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("john@test.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> {
            authService.register(request);
        });
    }
}
