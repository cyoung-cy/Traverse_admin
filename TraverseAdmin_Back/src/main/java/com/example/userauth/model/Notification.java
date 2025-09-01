package com.example.userauth.model;

import com.google.cloud.Timestamp;

public class Notification {
    private String user_id;                // userId -> user_id
    private String title;
    private String content;                // body 대신 content
    private String action_url;
    private String image_url;
    private boolean is_announcement;
    private String notification_category;
    private int read_count;
    private int recipient_count;
    private String reference_id;
    private Timestamp sent_at;
    private String sent_by;
    private String type;

    public Notification() {}

    // getters and setters

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAction_url() {
        return action_url;
    }

    public void setAction_url(String action_url) {
        this.action_url = action_url;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public boolean isIs_announcement() {
        return is_announcement;
    }

    public void setIs_announcement(boolean is_announcement) {
        this.is_announcement = is_announcement;
    }

    public String getNotification_category() {
        return notification_category;
    }

    public void setNotification_category(String notification_category) {
        this.notification_category = notification_category;
    }

    public int getRead_count() {
        return read_count;
    }

    public void setRead_count(int read_count) {
        this.read_count = read_count;
    }

    public int getRecipient_count() {
        return recipient_count;
    }

    public void setRecipient_count(int recipient_count) {
        this.recipient_count = recipient_count;
    }

    public String getReference_id() {
        return reference_id;
    }

    public void setReference_id(String reference_id) {
        this.reference_id = reference_id;
    }

    public Timestamp getSent_at() {
        return sent_at;
    }

    public void setSent_at(Timestamp sent_at) {
        this.sent_at = sent_at;
    }

    public String getSent_by() {
        return sent_by;
    }

    public void setSent_by(String sent_by) {
        this.sent_by = sent_by;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
