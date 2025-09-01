package com.example.userauth.model;

import com.example.userauth.model.id.PostEntityId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@IdClass(PostEntityId.class)
@Getter
@NoArgsConstructor
public class PostEntity {

    @Id
    @Column(name = "post_id")
    private String postId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "uid")
    private String uid;

    @Column(name = "title")
    private String title;

    @Column(name = "post_content", columnDefinition = "TEXT")
    private String postContent;

    @ElementCollection
    @CollectionTable(
            name = "post_images",
            joinColumns = {
                    @JoinColumn(name = "post_id", referencedColumnName = "post_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "image_url")
    private List<String> postImages;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "location")
    private String location;

    @ElementCollection
    @CollectionTable(
            name = "post_hash_tags",
            joinColumns = {
                    @JoinColumn(name = "post_id", referencedColumnName = "post_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "hash_tag")
    private List<String> hashTags;

    @Column(name = "comment_count")
    private int commentCount;

    @Column(name = "like_count")
    private int likeCount;

    @Column(name = "report_count")
    private int reportCount;

    @Column(name = "view_count")
    private int viewCount;

    @ElementCollection
    @CollectionTable(
            name = "post_liked_profiles",
            joinColumns = {
                    @JoinColumn(name = "post_id", referencedColumnName = "post_id"),
                    @JoinColumn(name = "synced_at", referencedColumnName = "synced_at")
            }
    )
    @Column(name = "profile_id")
    private List<String> likedProfiles;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Id
    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

    public LocalDateTime getSyncedAt() {
        return syncedAt;
    }

    public void setSyncedAt(LocalDateTime syncedAt) {
        this.syncedAt = syncedAt;
    }


    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
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

    public String getPostContent() {
        return postContent;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public List<String> getPostImages() {
        return postImages;
    }

    public void setPostImages(List<String> postImages) {
        this.postImages = postImages;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public int getReportCount() {
        return reportCount;
    }

    public void setReportCount(int reportCount) {
        this.reportCount = reportCount;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public List<String> getLikedProfiles() {
        return likedProfiles;
    }

    public void setLikedProfiles(List<String> likedProfiles) {
        this.likedProfiles = likedProfiles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

