package com.example.userauth.repository;

import com.example.userauth.model.NotificationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationHistoryRepository extends JpaRepository<NotificationHistory, Long> {
    Page<NotificationHistory> findAll(Pageable pageable);
}
