package com.example.userauth.model;

import com.google.cloud.Timestamp;
import lombok.Data;

import java.util.Map;

@Data
public class Inquiry {
    private String id;
    private String user_id;
    private String uid;
    private String category;
    private String message;
    private String status;
    private Timestamp created_at;
    private Map<String, Object> answer; // admin_id, message, answered_at

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Map<String, Object> getAnswer() {
        return answer;
    }

    public void setAnswer(Map<String, Object> answer) {
        this.answer = answer;
    }
}
