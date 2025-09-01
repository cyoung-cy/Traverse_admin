package com.example.userauth.dto.response;

import com.example.userauth.model.User;

import java.util.List;

public class UserListResponse {
    private boolean success;
    private List<User> users;
    private int total_count;
    private int current_page;
    private int total_pages;

    // Getter, Setter, Constructor 등 추가

    // 기본 생성자
    public UserListResponse() {
    }

    // 모든 필드를 인자로 받는 생성자
    public UserListResponse(boolean success, List<User> users, int total_count, int current_page, int total_pages) {
        this.success = success;
        this.users = users;
        this.total_count = total_count;
        this.current_page = current_page;
        this.total_pages = total_pages;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

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
}
