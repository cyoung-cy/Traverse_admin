package com.example.userauth.model.id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class UserEntityId implements Serializable {
    private String userId;
    private LocalDateTime syncedAt;

    public UserEntityId() {}

    public UserEntityId(String userId, LocalDateTime syncedAt) {
        this.userId = userId;
        this.syncedAt = syncedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEntityId)) return false;
        UserEntityId that = (UserEntityId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(syncedAt, that.syncedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, syncedAt);
    }
}
