package com.example.userauth.dto.request;

// 상태 업데이트 요청 모델
public class UserStatusUpdateRequest {
    private String status; // active, suspended, deleted
    private String reason;
    private Integer durationDays;

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }
}
