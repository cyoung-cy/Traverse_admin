package com.example.userauth.dto.request;

public class RoleUpdateRequest {
    private String role;
    private String status;  // 추가된 상태 변수 (active, suspended, deleted)

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
