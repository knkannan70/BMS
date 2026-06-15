package com.banking.service;

import com.banking.dto.TransactionResponse;
import com.banking.entity.Account;
import com.banking.entity.AccountStatus;
import com.banking.entity.Transaction;
import com.banking.exception.InsufficientBalanceException;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDepositSuccess() {
        Account account = new Account();
        account.setAccountNumber("12345");
        account.setBalance(new BigDecimal("100.00"));
        account.setStatus(AccountStatus.ACTIVE);

        when(accountRepository.findByAccountNumber(anyString())).thenReturn(Optional.of(account));
        when(transactionRepository.save(any())).thenAnswer(i -> {
            Transaction t = i.getArgument(0);
            t.setId(1L);
            return t;
        });

        TransactionResponse response = transactionService.deposit("12345", new BigDecimal("50.00"), "Deposit");

        assertNotNull(response);
        assertEquals(new BigDecimal("150.00"), account.getBalance());
        assertEquals(new BigDecimal("50.00"), response.getAmount());
    }

    @Test
    void testWithdrawInsufficientBalance() {
        Account account = new Account();
        account.setAccountNumber("12345");
        account.setBalance(new BigDecimal("10.00"));
        account.setStatus(AccountStatus.ACTIVE);

        when(accountRepository.findByAccountNumber(anyString())).thenReturn(Optional.of(account));

        assertThrows(InsufficientBalanceException.class, () -> {
            transactionService.withdraw("12345", new BigDecimal("50.00"), "Withdraw");
        });
    }
}
