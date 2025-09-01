package com.example.userauth.dto.response;

public class PostStatusUpdateResponseDTO {
    private Boolean success;
    private String message;

    public PostStatusUpdateResponseDTO(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
