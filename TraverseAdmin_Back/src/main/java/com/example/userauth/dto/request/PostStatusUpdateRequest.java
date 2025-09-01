package com.example.userauth.dto.request;

public class PostStatusUpdateRequest {
    private String status;      // active, hidden, deleted
    private String reason;
    private Boolean notify_user;

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

    public Boolean getnotify_user() {
        return notify_user;
    }

    public void setnotify_user(Boolean notify_user) {
        this.notify_user = notify_user;
    }
}
