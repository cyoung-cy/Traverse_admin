package com.example.userauth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AdminResponseDTO {
    private boolean success;
    private AdminData data;

    @Data
    @AllArgsConstructor
    public static class AdminData {
        private Long admin_id;
        private String name;
        private String email;
        private String role;
        private List<String> permissions;
        private String status;
        private Timestamp last_login_at;
        private Timestamp created_at;
        private Timestamp updated_at;
        private List<ActivityLog> activity_log;
    }

    @Data
    @AllArgsConstructor
    public static class ActivityLog {
        private String action;
        private Timestamp timestamp;
        private Map<String, Object> details;
    }
}

