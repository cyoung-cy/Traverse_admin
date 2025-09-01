package com.example.userauth.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ChatRoomDTO {

    private String roomId;
    private String name;
    private String type;
    private List<ChatParticipantDTO> participants;
    private String createdAt;
    private String lastMessageAt;
    private long messageCount;
    private long reportCount;
    private String status;

    private List<MessageDTO> messages;
    private List<ReportDTO> reports;

    public ChatRoomDTO() {
    }

    public ChatRoomDTO(String roomId, String name, String type,
                       List<ChatParticipantDTO> participants,
                       String createdAt, String lastMessageAt,
                       int messageCount, int reportCount, String status) {
        this.roomId = roomId;
        this.name = name;
        this.type = type;
        this.participants = participants;
        this.createdAt = createdAt;
        this.lastMessageAt = lastMessageAt;
        this.messageCount = messageCount;
        this.reportCount = reportCount;
        this.status = status;
    }


    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<ChatParticipantDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ChatParticipantDTO> participants) {
        this.participants = participants;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(String lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public long getMessageCount() {
        return messageCount;
    }

    public void setMessageCount(long messageCount) {
        this.messageCount = messageCount;
    }

    public long getReportCount() {
        return reportCount;
    }

    public void setReportCount(long reportCount) {
        this.reportCount = reportCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<MessageDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDTO> messages) {
        this.messages = messages;
    }

    public List<ReportDTO> getReports() {
        return reports;
    }

    public void setReports(List<ReportDTO> reports) {
        this.reports = reports;
    }

    // Getters and Setters...
}
