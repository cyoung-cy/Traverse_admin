package com.example.userauth.model.id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class SnapPostEntityId implements Serializable {

    private String snapId;
    private LocalDateTime syncedAt;

    public SnapPostEntityId() {}

    public SnapPostEntityId(String snapId, LocalDateTime syncedAt) {
        this.snapId = snapId;
        this.syncedAt = syncedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SnapPostEntityId)) return false;
        SnapPostEntityId that = (SnapPostEntityId) o;
        return Objects.equals(snapId, that.snapId) &&
                Objects.equals(syncedAt, that.syncedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(snapId, syncedAt);
    }
}
