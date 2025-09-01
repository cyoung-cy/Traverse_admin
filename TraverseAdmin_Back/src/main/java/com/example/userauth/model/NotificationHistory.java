package com.example.userauth.model;

import com.google.cloud.Timestamp;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_history")
public class NotificationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(name = "template_id")
    private String templateId;

    @Column(name = "template_name")
    private String templateName;

    private String type;

    @Column(name = "sent_at")
    private Timestamp sentAt;

    @Column(name = "recipient_count")
    private int recipientCount;

    @Column(name = "read_count")
    private int readCount;

    @Column(name = "sent_by")
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

    public Timestamp  getSentAt() { return sentAt; }
    public void setSentAt(Timestamp  sentAt) { this.sentAt = sentAt; }

    public int getRecipientCount() { return recipientCount; }
    public void setRecipientCount(int recipientCount) { this.recipientCount = recipientCount; }

    public int getReadCount() { return readCount; }
    public void setReadCount(int readCount) { this.readCount = readCount; }

    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
}
