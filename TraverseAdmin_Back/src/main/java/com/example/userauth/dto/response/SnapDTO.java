package com.example.userauth.dto.response;

import com.google.cloud.Timestamp;

import java.util.List;

public class SnapDTO {

    public static class SnapListResponse {
        private String id;
        private String title;
        private String user_id;
        private String status;
        private String created_at;
        private String image_url;
        private int like_count;
        private int view_count;
        private List<String> captions;
        private List<String> hash_tags;
        private List<String> snap_images;
        private int comment_count;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getUser_id() { return user_id; }
        public void setUser_id(String user_id) { this.user_id = user_id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getCreated_at() { return created_at; }
        public void setCreated_at(String  created_at) { this.created_at = created_at; }

        public String getImage_url() { return image_url; }
        public void setImage_url(String image_url) { this.image_url = image_url; }

        public int getLike_count() { return like_count; }
        public void setLike_count(int like_count) { this.like_count = like_count; }

        public int getView_count() { return view_count; }
        public void setView_count(int view_count) { this.view_count = view_count; }

        public List<String> getCaptions() { return captions; }
        public void setCaptions(List<String> captions) { this.captions = captions; }

        public List<String> getHash_tags() { return hash_tags; }
        public void setHash_tags(List<String> hash_tags) { this.hash_tags = hash_tags; }

        public List<String> getSnap_images() { return snap_images; }
        public void setSnap_images(List<String> snap_images) { this.snap_images = snap_images; }

        public int getComment_count() { return comment_count; }
        public void setComment_count(int comment_count) { this.comment_count = comment_count; }
    }

    public static class SnapListPageResponse {
        private List<SnapListResponse> snaps;
        private long total_count;
        private int current_page;
        private int limit;
        private int total_pages;

        // Getters and Setters
        public List<SnapListResponse> getSnaps() { return snaps; }
        public void setSnaps(List<SnapListResponse> snaps) { this.snaps = snaps; }

        public long getTotal_count() { return total_count; }
        public void setTotal_count(long total_count) { this.total_count = total_count; }

        public int getCurrent_page() { return current_page; }
        public void setCurrent_page(int current_page) { this.current_page = current_page; }

        public int getLimit() { return limit; }
        public void setLimit(int limit) { this.limit = limit; }

        public int getTotal_pages() { return total_pages; }
        public void setTotal_pages(int total_pages) { this.total_pages = total_pages; }
    }

    public static class SnapDetailResponse {
        private String id;
        private String title;
        private String user_id;
        private String status;
        private String created_at;
        private List<String> snap_images;
        private int like_count;
        private int view_count;
        private List<String> captions;
        private List<String> hash_tags;
        private int comment_count;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getUser_id() { return user_id; }
        public void setUser_id(String user_id) { this.user_id = user_id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getCreated_at() { return created_at; }
        public void setCreated_at(String created_at) { this.created_at = created_at; }

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
    }

    public static class SnapStatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class SnapStatusUpdateResponse {
        private String id;
        private String status;
        private String updated_at;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getUpdated_at() { return updated_at; }
        public void setUpdated_at(String updated_at) { this.updated_at = updated_at; }
    }

    public static class SnapStatisticsResponse {
        private int total;
        private int active;
        private int hidden;
        private int deleted;

        public int getTotal() {
            return total;
        }
        public void setTotal(int total) {
            this.total = total;
        }

        public int getActive() {
            return active;
        }
        public void setActive(int active) {
            this.active = active;
        }

        public int getHidden() {
            return hidden;
        }
        public void setHidden(int hidden) {
            this.hidden = hidden;
        }

        public int getDeleted() {
            return deleted;
        }
        public void setDeleted(int deleted) {
            this.deleted = deleted;
        }
    }
}