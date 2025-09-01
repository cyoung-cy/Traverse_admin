package com.example.userauth.model;

import com.google.cloud.Timestamp;

import java.util.List;

public class SnapPost {
    private String id;
    private String title;
    private String user_id;
    private String status;
    private Timestamp created_at; // <-- 변경됨
    private List<String> snap_images;
    private int like_count;
    private int view_count;
    private List<String> captions;
    private List<String> hash_tags;
    private int comment_count;

    private String profile_imageurl;
    private String country_code;
    private String uid;
    private Timestamp updated_at; // <-- 가능하면 이것도 Timestamp로

    private String snap_id;

    public SnapPost() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUser_id() { return user_id; }
    public void setUser_id(String user_id) { this.user_id = user_id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreated_at() { return created_at; } // <-- 변경됨
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }

    public List<String> getSnap_images() { return snap_images; }
    public void setSnap_images(List<String> snap_images) { this.snap_images = snap_images; }

    public int getLike_count() { return like_count; }
    public void setLike_count(int like_count) { this.like_count = like_count; }

    public int getView_count() { return view_count; }
    public void setView_count(int view_count) { this.view_count = view_count; }

    public List<String> getCaptions() { return captions; }
    public void setCaptions(List<String> captions) { this.captions = captions; }

    public List<String> getHash_tags() { return hash_tags; }
    public void setHash_tags(List<String> hash_tags) { this.hash_tags = hash_tags; }

    public int getComment_count() { return comment_count; }
    public void setComment_count(int comment_count) { this.comment_count = comment_count; }

    public String getProfile_imageurl() {
        return profile_imageurl;
    }

    public void setProfile_imageurl(String profile_imageurl) {
        this.profile_imageurl = profile_imageurl;
    }

    public String getCountry_code() {
        return country_code;
    }

    public void setCountry_code(String country_code) {
        this.country_code = country_code;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Timestamp getUpdated_at() { return updated_at; } // <-- 변경됨
    public void setUpdated_at(Timestamp updated_at) { this.updated_at = updated_at; }

    public String getSnap_id() {
        return snap_id;
    }

    public void setSnap_id(String snap_id) {
        this.snap_id = snap_id;
    }
}
