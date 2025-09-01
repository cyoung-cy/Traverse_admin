package com.example.userauth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.cloud.Timestamp;

import java.time.LocalDateTime;

public class NotificationHistoryItemDTO {
    @JsonProperty("id")
    private String id;

    @JsonProperty("template_id")
    private String templateId;

    @JsonProperty("template_name")
    private String templateName;

    @JsonProperty("type")
    private String type;

    @JsonProperty("sent_at")
    private String sentAt;

    @JsonProperty("recipient_count")
    private int recipientCount;

    @JsonProperty("read_count")
    private int readCount;

    @JsonProperty("sent_by")
    private String sentBy;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }

    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String  getSentAt() { return sentAt; }
    public void setSentAt(String  sentAt) { this.sentAt = sentAt; }

    public int getRecipientCount() { return recipientCount; }
    public void setRecipientCount(int recipientCount) { this.recipientCount = recipientCount; }

    public int getReadCount() { return readCount; }
    public void setReadCount(int readCount) { this.readCount = readCount; }

    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
}
