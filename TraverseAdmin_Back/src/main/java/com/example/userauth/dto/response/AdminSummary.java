package com.example.userauth.dto.response;

import java.sql.Timestamp;

public class AdminSummary {

    private String name;
    private String role;
    private Long admin_id;
    private String email;
    private String status;
    private Timestamp last_login_at;

    public AdminSummary(String name, String role, Long admin_id, String email, String status, Timestamp last_login_at) {
        this.name = name;
        this.role = role;
        this.admin_id = admin_id;
        this.email = email;
        this.status = status;
        this.last_login_at = last_login_at;
    }

    // Getter와 Setter

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getAdmin_id() {
        return admin_id;
    }

    public void setAdmin_id(Long admin_id) {
        this.admin_id = admin_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getLast_login_at() {
        return last_login_at;
    }

    public void setLast_login_at(Timestamp last_login_at) {
        this.last_login_at = last_login_at;
    }
}
