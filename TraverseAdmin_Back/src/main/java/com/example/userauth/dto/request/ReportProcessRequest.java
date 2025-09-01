package com.example.userauth.dto.request;

public class ReportProcessRequest {

    private String status;
    private String action_taken;
    private String comment;
    private boolean notify_reporter;
    private boolean notify_reported;
    private Integer suspension_duration;

    // Getters and Setters

    public String getAction_taken() {
        return action_taken;
    }

    public void setAction_taken(String action_taken) {
        this.action_taken = action_taken;
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

    public Integer getSuspension_duration() {
        return suspension_duration;
    }

    public void setSuspension_duration(Integer suspension_duration) {
        this.suspension_duration = suspension_duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActionTaken() {
        return action_taken;
    }

    public void setActionTaken(String action_taken) {
        this.action_taken = action_taken;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isNotifyReporter() {
        return notify_reporter;
    }

    public void setNotifyReporter(boolean notify_reporter) {
        this.notify_reporter = notify_reporter;
    }

    public boolean isNotifyReported() {
        return notify_reported;
    }

    public void setNotifyReported(boolean notify_reported) {
        this.notify_reported = notify_reported;
    }

    public Integer getSuspensionDuration() {
        return suspension_duration;
    }

    public void setSuspensionDuration(Integer suspension_duration) {
        this.suspension_duration = suspension_duration;
    }
}
