package com.example.userauth.repository;

import com.example.userauth.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByAdminIdAndActionAndTimestampBetween(
            Long adminId, String action, LocalDateTime start,
            LocalDateTime end);

    List<ActivityLog> findByAdminId(Long adminId);

    List<ActivityLog> findByAction(String action);

    List<ActivityLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
}
