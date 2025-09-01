package com.example.userauth.model.id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class PostEntityId implements Serializable {

    private String postId;
    private LocalDateTime syncedAt;

    public PostEntityId() {}

    public PostEntityId(String postId, LocalDateTime syncedAt) {
        this.postId = postId;
        this.syncedAt = syncedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostEntityId)) return false;
        PostEntityId that = (PostEntityId) o;
        return Objects.equals(postId, that.postId) &&
                Objects.equals(syncedAt, that.syncedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId, syncedAt);
    }
}
