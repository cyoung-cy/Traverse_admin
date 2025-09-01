package com.example.userauth.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class MainDashboardResponseDTO {

    private boolean success;
    private Data data;

    @lombok.Data
    public static class Data {
        private UserStats user_stats;
        private ContentStats content_stats;
        private ReportStats report_stats;
        private List<RecentActivity> recent_activity;
        private long total_users;        // Firestore 실시간 총 유저 수
        private long recent_reports;     // 오늘 생성된 신고 수
        private long active_chat_rooms;  // Firestore에서 활성 채팅방 수

    }

    @lombok.Data
    public static class UserStats {
        private long total;
        private long active;
        private long newUsers;
        private double growth;
    }

    @lombok.Data
    public static class ContentStats {
        private long total_posts;
        private long new_posts;
        private long pending_review;
        private long comment_count;
    }

    @lombok.Data
    public static class ReportStats {
        private long total;
        private long pending;
        private long resolved;
        private List<CategoryCount> by_category;
    }

    @lombok.Data
    public static class CategoryCount {
        private String category;
        private long count;
    }

    @lombok.Data
    public static class RecentActivity {
        private String type;
        private LocalDateTime timestamp;
        private Map<String, Object> details;
    }
}
