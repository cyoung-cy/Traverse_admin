package com.example.userauth.model.id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class ReportEntityId implements Serializable {

    private String reportId;
    private LocalDateTime syncedAt;

    public ReportEntityId() {}

    public ReportEntityId(String reportId, LocalDateTime syncedAt) {
        this.reportId = reportId;
        this.syncedAt = syncedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReportEntityId)) return false;
        ReportEntityId that = (ReportEntityId) o;
        return Objects.equals(reportId, that.reportId) &&
                Objects.equals(syncedAt, that.syncedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reportId, syncedAt);
    }
}
