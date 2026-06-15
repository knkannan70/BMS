package com.banking.controller;

import com.banking.dto.DepositRequest;
import com.banking.dto.TransactionResponse;
import com.banking.dto.TransferRequest;
import com.banking.dto.WithdrawRequest;
import com.banking.service.AccountService;
import com.banking.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DepositRequest request) {
        String accountNumber = accountService.getProfile(userDetails.getUsername()).getAccountNumber();
        return ResponseEntity.ok(transactionService.deposit(accountNumber, request.getAmount(), "Online Deposit"));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WithdrawRequest request) {
        String accountNumber = accountService.getProfile(userDetails.getUsername()).getAccountNumber();
        return ResponseEntity.ok(transactionService.withdraw(accountNumber, request.getAmount(), "Online Withdrawal"));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransferRequest request) {
        String accountNumber = accountService.getProfile(userDetails.getUsername()).getAccountNumber();
        return ResponseEntity.ok(transactionService.transfer(accountNumber, request.getRecipientAccountNumber(), request.getAmount()));
    }

    @GetMapping("/statement")
    public ResponseEntity<List<TransactionResponse>> getStatement(
            @AuthenticationPrincipal UserDetails userDetails) {
        String accountNumber = accountService.getProfile(userDetails.getUsername()).getAccountNumber();
        return ResponseEntity.ok(transactionService.getStatement(accountNumber));
    }
}
