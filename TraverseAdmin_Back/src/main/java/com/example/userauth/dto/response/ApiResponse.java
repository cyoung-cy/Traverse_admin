package com.example.userauth.dto.response;


import com.example.userauth.model.ActivityLog;

import java.util.List;

public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;  // 선택적 데이터 필드
    private boolean error;
    private int total_count;
    private int current_page;
    private int total_pages;

    // boolean과 String만 받는 생성자
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;

    }

    // boolean, message와 함께 data를 받는 생성자
    public ApiResponse(boolean success, Object data) {
        this.success = success;
        this.data = data;
    }

    // boolean, String, 그리고 data를 받는 생성자 (선택적)
    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success, String message, List<ActivityLog> logs, int total_count, int current_page, int total_pages) {
        this.success = success;
        this.message = message;
        this.data = logs;
        this.total_count = total_count;
        this.current_page = current_page;
        this.total_pages = total_pages;
    }

    // Getters와 Setters


    public int getTotal_count() {
        return total_count;
    }

    public void setTotal_count(int total_count) {
        this.total_count = total_count;
    }

    public int getCurrent_page() {
        return current_page;
    }

    public void setCurrent_page(int current_page) {
        this.current_page = current_page;
    }

    public int getTotal_pages() {
        return total_pages;
    }

    public void setTotal_pages(int total_pages) {
        this.total_pages = total_pages;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
