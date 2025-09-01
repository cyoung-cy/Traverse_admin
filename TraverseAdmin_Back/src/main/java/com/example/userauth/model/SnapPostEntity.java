package com.example.userauth.model;

import com.example.userauth.model.id.SnapPostEntityId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "snap_posts")
@IdClass(SnapPostEntityId.class) // ← 복합키 설정
@Getter
@NoArgsConstructor
public class SnapPostEntity {

    @Id
    @Column(name = "snap_id")
    private String snapId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "uid")
    private String uid;

    @Column(name = "title")
    private String title;

    @ElementCollection
    @CollectionTable(
            name = "snap_captions",
            joinColumns = {
                    @JoinColumn(name = "snap_id", referencedColumnName = "snap_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "caption")
    private List<String> captions;

    @ElementCollection
    @CollectionTable(
            name = "snap_images",
            joinColumns = {
                    @JoinColumn(name = "snap_id", referencedColumnName = "snap_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "image_url")
    private List<String> snapImages;

    @ElementCollection
    @CollectionTable(
            name = "snap_hash_tags",
            joinColumns = {
                    @JoinColumn(name = "snap_id", referencedColumnName = "snap_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "hash_tag")
    private List<String> hashTags;


    @Column(name = "comment_count")
    private int commentCount;

    @Column(name = "like_count")
    private int likeCount;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageurl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Id
    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

    public LocalDateTime getSyncedAt() {
        return syncedAt;
    }

    public void setSyncedAt(LocalDateTime syncedAt) {
        this.syncedAt = syncedAt;
    }

    public String getSnapId() {
        return snapId;
    }

    public void setSnapId(String snapId) {
        this.snapId = snapId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getCaptions() {
        return captions;
    }

    public void setCaptions(List<String> captions) {
        this.captions = captions;
    }

    public List<String> getSnapImages() {
        return snapImages;
    }

    public void setSnapImages(List<String> snapImages) {
        this.snapImages = snapImages;
    }

    public List<String> getHashTags() {
        return hashTags;
    }

    public void setHashTags(List<String> hashTags) {
        this.hashTags = hashTags;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getProfileImageurl() {
        return profileImageurl;
    }

    public void setProfileImageurl(String profileImageurl) {
        this.profileImageurl = profileImageurl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

