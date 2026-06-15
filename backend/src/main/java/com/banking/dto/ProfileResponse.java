package com.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private String fullName;
    private LocalDate dob;
    private String address;
    private String mobile;
    private String email;
    private String accountNumber;
    private BigDecimal balance;
    private String status;
}
