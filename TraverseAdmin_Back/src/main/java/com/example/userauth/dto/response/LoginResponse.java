package com.example.userauth.dto.response;

public class LoginResponse {

    private boolean success;
    private String message;
    private String email;
    private String name;
    private String token;  // 추가된 필드
    private String admin_id;  // 추가된 필드
    private String role;  // 추가된 필드

    // 기본 생성자
    public LoginResponse() {}

    // 생성자
    public LoginResponse(boolean success, String message, String email, String name, String token, String admin_id, String role) {
        this.success = success;
        this.message = message;
        this.email = email;
        this.name = name;
        this.token = token;
        this.admin_id = admin_id;
        this.role = role;
    }

    public LoginResponse(String token, String adminId, String name, String role) {
        this.token = token;
        this.admin_id = adminId;
        this.name = name;
        this.role = role;

    }

    public LoginResponse(String token) {
        this.token = token;
    }


    // Getter 메서드들
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getToken() {
        return token;
    }



    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setAdmin_id(String admin_id) {
        this.admin_id = admin_id;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAdmin_id() {
        return admin_id;
    }

    public String getRole() {
        return role;
    }
}
