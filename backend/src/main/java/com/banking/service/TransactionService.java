package com.banking.service;

import com.banking.dto.TransactionResponse;
import com.banking.entity.Account;
import com.banking.entity.Transaction;
import com.banking.entity.TransactionType;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.InvalidTransactionException;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse deposit(String accountNumber, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Deposit amount must be greater than zero");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.DEPOSIT)
                .amount(amount)
                .description(description)
                .balanceAfterTransaction(account.getBalance())
                .account(account)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse withdraw(String accountNumber, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Withdrawal amount must be greater than zero");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(amount)
                .description(description)
                .balanceAfterTransaction(account.getBalance())
                .account(account)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        if (fromAccountNumber.equals(toAccountNumber)) {
            throw new InvalidTransactionException("Cannot transfer to the same account");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Transfer amount must be greater than zero");
        }

        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found"));

        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Recipient account not found"));

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for transfer");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction outTransaction = Transaction.builder()
                .transactionType(TransactionType.TRANSFER_OUT)
                .amount(amount)
                .description("Transfer to " + toAccountNumber)
                .balanceAfterTransaction(fromAccount.getBalance())
                .account(fromAccount)
                .build();

        Transaction inTransaction = Transaction.builder()
                .transactionType(TransactionType.TRANSFER_IN)
                .amount(amount)
                .description("Transfer from " + fromAccountNumber)
                .balanceAfterTransaction(toAccount.getBalance())
                .account(toAccount)
                .build();

        outTransaction = transactionRepository.save(outTransaction);
        transactionRepository.save(inTransaction);

        return mapToResponse(outTransaction);
    }

    public List<TransactionResponse> getStatement(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .balanceAfterTransaction(transaction.getBalanceAfterTransaction())
                .build();
    }
}
