package com.banking.repository;

import com.banking.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    Page<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId, Pageable pageable);
    List<Transaction> findByAccountIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long accountId, LocalDateTime startDate, LocalDateTime endDate);
}
