package com.banking.dto;

import com.banking.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private TransactionType transactionType;
    private BigDecimal amount;
    private String description;
    private LocalDateTime transactionDate;
    private BigDecimal balanceAfterTransaction;
}
