package com.example.userauth.service;

import com.example.userauth.model.ActivityLog;
import com.example.userauth.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    // 관리자 활동 로그 기록
    public void logActivity(Long admin_id, String adminName, String action, String details, String ipAddress) {
        ActivityLog log = new ActivityLog();
        log.setAdminId(admin_id);
        log.setAdmin_name(adminName);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        log.setDetails(details);
        log.setIp_address(ipAddress);

        activityLogRepository.save(log);

        ActivityLog activityLog = new ActivityLog();
        activityLog.setAdminId(admin_id);
        activityLog.setAdmin_name(adminName);
        activityLog.setAction(action);
        activityLog.setTimestamp(LocalDateTime.now());
        activityLog.setDetails(details);
        activityLog.setIp_address(ipAddress);

        // 로그를 데이터베이스에 저장
        activityLogRepository.save(activityLog);
    }

    // 활동 로그 조회
    public List<ActivityLog> getActivityLogs(Long admin_id, String action, LocalDateTime startDate, LocalDateTime endDate) {
        if (admin_id != null && action != null && startDate != null && endDate != null) {
            return activityLogRepository.findByAdminIdAndActionAndTimestampBetween(admin_id, action, startDate, endDate);
        } else if (admin_id != null) {
            return activityLogRepository.findByAdminId(admin_id);
        } else if (action != null) {
            return activityLogRepository.findByAction(action);
        } else if (startDate != null && endDate != null) {
            return activityLogRepository.findByTimestampBetween(startDate, endDate);
        }
        return activityLogRepository.findAll();
    }
}
