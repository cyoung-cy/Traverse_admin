package com.example.userauth.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String report_id;
    @Column(name = "reported_user_id", insertable = false, updatable = false)
    private String reported_user_id;
    private String reported_user_name;
    private String reason;
    private String description;
    private String status;
    private String category; // 카테고리 필드 추가
    @Column(name = "created_at")
    private LocalDateTime created_at;   //Timestamp이긴함
    @Column(name = "updated_at")
    private LocalDateTime updated_at;   //Timestamp이긴함
    private int severity;

    //신고 처리
    private String action_taken;
    private String comment;
    private boolean notify_reporter;
    private boolean notify_reported;
    private int suspension_duration;

    //신고 상세 조회
    private String type;
    private String target_id;
    private String processed_by;
    private LocalDateTime processed_at;
    @ElementCollection
    private List<String> evidence; // 첨부 파일/이미지 URL
    @ManyToOne
    @JoinColumn(name = "reporter_user_id")
    private User reporter;
    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;


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

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public String getAction_taken() {
        return action_taken;
    }

    public void setAction_taken(String action_taken) {
        this.action_taken = action_taken;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isNotify_reporter() {
        return notify_reporter;
    }

    public void setNotify_reporter(boolean notify_reporter) {
        this.notify_reporter = notify_reporter;
    }

    public boolean isNotify_reported() {
        return notify_reported;
    }

    public void setNotify_reported(boolean notify_reported) {
        this.notify_reported = notify_reported;
    }

    public int getSuspension_duration() {
        return suspension_duration;
    }

    public void setSuspension_duration(int suspension_duration) {
        this.suspension_duration = suspension_duration;
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

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public User getReportedUser() {
        return reportedUser;
    }

    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
