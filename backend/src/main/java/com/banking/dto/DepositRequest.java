package com.banking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositRequest {

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "1.0", message = "Deposit amount must be greater than zero")
    private BigDecimal amount;
}
