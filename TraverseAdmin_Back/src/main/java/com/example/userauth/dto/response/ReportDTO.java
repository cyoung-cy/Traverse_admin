package com.example.userauth.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ReportDTO {
    private String report_id;
    private String reported_user_id;
    private String reported_user_name;
    private String reporter_user_id;
    private String reporter_name;

    private String type;
    private String report_type;    // Firestore의 report_type 필드// 신고 유형 (user, post, chat)
    private String target_id;           // 신고 대상 ID (reported_user_id와 동일)
    private Object target_details;      // 신고 대상 상세 정보 (reported_user_name 포함)

    private Map<String, Object> reporter_details;  // 신고자 정보 (username, email 등)

    private String reason;
    private String description;
    private String status;
    private LocalDateTime created_at;   //Timestamp이긴함
    private LocalDateTime updated_at;   //Timestamp이긴함
    private Long severity;
    private List<String> evidence;
    private String processed_by;
    private LocalDateTime processed_at;
    private String comment;
    private String action_taken;
    private String post_id;
    private String title;
    private String post_content;
    private String chat_id;
    private String chat_room_id;
    private String snap_id;
    private String snap_title;
    private String snap_content;
    private String comment_id;
    private String parent_comment_id;
    private String comment_content;
    private String chat_content;


    // Getters and Setters


    public String getReport_type() {
        return report_type;
    }

    public void setReport_type(String report_type) {
        this.report_type = report_type;
    }

    public Map<String, Object> getReporter_details() {
        return reporter_details;
    }

    public void setReporter_details(Map<String, Object> reporter_details) {
        this.reporter_details = reporter_details;
    }

    public String getReport_id() {
        return report_id;
    }

    public void setReport_id(String report_id) {
        this.report_id = report_id;
    }

    public String getReported_user_id() {
        return reported_user_id;
    }

    public void setReported_user_id(String reported_user_id) {
        this.reported_user_id = reported_user_id;
    }

    public String getReported_user_name() {
        return reported_user_name;
    }

    public void setReported_user_name(String reported_user_name) {
        this.reported_user_name = reported_user_name;
    }

    public String getReporter_user_id() {
        return reporter_user_id;
    }

    public void setReporter_user_id(String reporter_user_id) {
        this.reporter_user_id = reporter_user_id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Long getSeverity() {
        return severity;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public void setSeverity(Long severity) {
        this.severity = severity;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTarget_id() {
        return target_id;
    }

    public void setTarget_id(String target_id) {
        this.target_id = target_id;
    }

    public Object getTarget_details() {
        return target_details;
    }

    public void setTarget_details(Object target_details) {
        this.target_details = target_details;
    }

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public String getProcessed_by() {
        return processed_by;
    }

    public void setProcessed_by(String processed_by) {
        this.processed_by = processed_by;
    }

    public LocalDateTime getProcessed_at() {
        return processed_at;
    }

    public void setProcessed_at(LocalDateTime processed_at) {
        this.processed_at = processed_at;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAction_taken() {
        return action_taken;
    }

    public void setAction_taken(String action_taken) {
        this.action_taken = action_taken;
    }

    public String getPost_id() {
        return post_id;
    }

    public void setPost_id(String post_id) {
        this.post_id = post_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getChat_id() {
        return chat_id;
    }

    public void setChat_id(String chat_id) {
        this.chat_id = chat_id;
    }

    public String getChat_room_id() {
        return chat_room_id;
    }

    public void setChat_room_id(String chat_room_id) {
        this.chat_room_id = chat_room_id;
    }

    public String getSnap_id() {
        return snap_id;
    }

    public void setSnap_id(String snap_id) {
        this.snap_id = snap_id;
    }

    public String getSnap_title() {
        return snap_title;
    }

    public void setSnap_title(String snap_title) {
        this.snap_title = snap_title;
    }

    public String getSnap_content() {
        return snap_content;
    }

    public void setSnap_content(String snap_content) {
        this.snap_content = snap_content;
    }

    public String getPost_content() {
        return post_content;
    }

    public void setPost_content(String post_content) {
        this.post_content = post_content;
    }

    public String getComment_id() {
        return comment_id;
    }

    public void setComment_id(String comment_id) {
        this.comment_id = comment_id;
    }

    public String getParent_comment_id() {
        return parent_comment_id;
    }

    public void setParent_comment_id(String parent_comment_id) {
        this.parent_comment_id = parent_comment_id;
    }

    public String getComment_content() {
        return comment_content;
    }

    public void setComment_content(String comment_content) {
        this.comment_content = comment_content;
    }

    public String getChat_content() {
        return chat_content;
    }

    public void setChat_content(String chat_content) {
        this.chat_content = chat_content;
    }

    public String getReporter_name() {
        return reporter_name;
    }

    public void setReporter_name(String reporter_name) {
        this.reporter_name = reporter_name;
    }
}
