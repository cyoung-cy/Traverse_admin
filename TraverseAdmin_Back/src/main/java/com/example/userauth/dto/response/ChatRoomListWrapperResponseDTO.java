package com.example.userauth.dto.response;

public class ChatRoomListWrapperResponseDTO {
    private boolean success;
    private ChatRoomListResponseDTO data;

    public ChatRoomListWrapperResponseDTO() {
    }

    public ChatRoomListWrapperResponseDTO(boolean success, ChatRoomListResponseDTO data) {
        this.success = success;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public ChatRoomListResponseDTO getData() {
        return data;
    }

    public void setData(ChatRoomListResponseDTO data) {
        this.data = data;
    }
}
