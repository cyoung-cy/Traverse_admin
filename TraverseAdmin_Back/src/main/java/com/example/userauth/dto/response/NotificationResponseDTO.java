package com.example.userauth.dto.response;

import java.util.List;

public class NotificationResponseDTO {
    private boolean success;
    private List<String> sentTo;

    public NotificationResponseDTO() {}

    public NotificationResponseDTO(boolean success, List<String> sentTo) {
        this.success = success;
        this.sentTo = sentTo;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<String> getSentTo() {
        return sentTo;
    }

    public void setSentTo(List<String> sentTo) {
        this.sentTo = sentTo;
    }
}
