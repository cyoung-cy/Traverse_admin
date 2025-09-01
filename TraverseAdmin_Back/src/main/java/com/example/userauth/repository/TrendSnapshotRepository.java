package com.example.userauth.repository;

import com.example.userauth.model.TrendSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TrendSnapshotRepository extends JpaRepository<TrendSnapshot, Long> {
    Optional<TrendSnapshot> findByDate(LocalDate date);
    List<TrendSnapshot> findByDateBetween(LocalDate start, LocalDate end);
}
