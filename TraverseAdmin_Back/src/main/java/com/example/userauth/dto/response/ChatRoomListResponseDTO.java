package com.example.userauth.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ChatRoomListResponseDTO {

    private List<ChatRoomDTO> rooms;
    private int totalCount;
    private int currentPage;
    private int totalPages;

    public ChatRoomListResponseDTO(List<ChatRoomDTO> rooms, int totalCount, int currentPage, int totalPages) {
        this.rooms = rooms;
        this.totalCount = totalCount;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }

    public List<ChatRoomDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<ChatRoomDTO> rooms) {
        this.rooms = rooms;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    // Getters and Setters...
}
