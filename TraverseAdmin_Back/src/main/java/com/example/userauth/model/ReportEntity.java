package com.example.userauth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.example.userauth.model.id.ReportEntityId;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@IdClass(ReportEntityId.class)
@Getter
@NoArgsConstructor
public class ReportEntity {

    @Id
    @Column(name = "report_id")
    private String reportId;

    @Column(name = "report_type")
    private String reportType; // "user", "post", "snap", "chat", "comment" 등

    @Column(name = "status")
    private String status; // e.g. "pending"

    @Column(name = "severity")
    private Integer severity;

    @Column(name = "reason")
    private String reason;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reporter_user_id")
    private String reporterUserId;

    @Column(name = "reported_user_id")
    private String reportedUserId;

    @Column(name = "reported_user_name")
    private String reportedUserName;

    @Column(name = "post_id")
    private String postId;

    @Column(name = "post_content", columnDefinition = "TEXT")
    private String postContent;

    @Column(name = "snap_id")
    private String snapId;

    @Column(name = "snap_content", columnDefinition = "TEXT")
    private String snapContent;

    @Column(name = "comment_id")
    private String commentId;

    @Column(name = "parent_comment_id")
    private String parentCommentId;

    @Column(name = "comment_content", columnDefinition = "TEXT")
    private String commentContent;

    @Column(name = "chat_id")
    private String chatId;

    @Column(name = "chat_room_id")
    private String chatRoomId;

    @Column(name = "chat_content", columnDefinition = "TEXT")
    private String chatContent;

    @Id
    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

    public LocalDateTime getSyncedAt() {
        return syncedAt;
    }

    public void setSyncedAt(LocalDateTime syncedAt) {
        this.syncedAt = syncedAt;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getSeverity() {
        return severity;
    }

    public void setSeverity(Integer severity) {
        this.severity = severity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getReporterUserId() {
        return reporterUserId;
    }

    public void setReporterUserId(String reporterUserId) {
        this.reporterUserId = reporterUserId;
    }

    public String getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(String reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getPostContent() {
        return postContent;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public String getSnapId() {
        return snapId;
    }

    public void setSnapId(String snapId) {
        this.snapId = snapId;
    }

    public String getSnapContent() {
        return snapContent;
    }

    public void setSnapContent(String snapContent) {
        this.snapContent = snapContent;
    }

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getCommentContent() {
        return commentContent;
    }

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public String getChatContent() {
        return chatContent;
    }

    public void setChatContent(String chatContent) {
        this.chatContent = chatContent;
    }
}

