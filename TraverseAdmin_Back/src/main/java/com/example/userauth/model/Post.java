package com.example.userauth.model;

import jakarta.persistence.ElementCollection;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class Post {
    private String post_id;
    private String user_id;
    private String status;
    private String created_at;
    private Long report_count;
    private int like_count;
    private int view_count;
    @ElementCollection
    private List<String> hash_tags;

    private String user_name;  // 추가: 사용자 이름
    private String title;  // 추가: 제목
    private String post_content;  // 추가: 게시물 내용
    private String updated_at;  // 추가: 수정 시간
    private int comment_count;  // 추가: 댓글 수
    @ElementCollection
    private List<String> post_images;  // 추가: 게시물 이미지
    @ElementCollection
    private List<Comment> comments;  // 추가: 댓글 목록
    @ElementCollection
    private List<Report> reports;  // 추가: 신고 목록

    @Getter
    @NoArgsConstructor
    public static class Comment {
        private String comment_id;
        private String user_id;
        private String user_name;
        private String content;
        private String created_at;
        private int report_count;
        private int like_count;
        private int view_count;
        private String post_id;

        public String getComment_id() {
            return comment_id;
        }

        public void setComment_id(String comment_id) {
            this.comment_id = comment_id;
        }

        public String getUser_id() {
            return user_id;
        }

        public void setUser_id(String user_id) {
            this.user_id = user_id;
        }

        public String getUser_name() {
            return user_name;
        }

        public void setUser_name(String user_name) {
            this.user_name = user_name;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getCreated_at() {
            return created_at;
        }

        public void setCreated_at(String created_at) {
            this.created_at = created_at;
        }

        public int getReport_count() {
            return report_count;
        }

        public void setReport_count(int report_count) {
            this.report_count = report_count;
        }

        public int getLike_count() {
            return like_count;
        }

        public void setLike_count(int like_count) {
            this.like_count = like_count;
        }

        public int getView_count() {
            return view_count;
        }

        public void setView_count(int view_count) {
            this.view_count = view_count;
        }

        public String getPost_id() {
            return post_id;
        }

        public void setPost_id(String post_id) {
            this.post_id = post_id;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Report {
        private String report_id;
        private String reporter_id;
        private String reporter_name;
        private String reported_id;
        private String reported_name;
        private String reason;
        private String status;
        private LocalDateTime created_at;
        private String post_content;

        public String getReport_id() {
            return report_id;
        }

        public void setReport_id(String report_id) {
            this.report_id = report_id;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getReporter_id() {
            return reporter_id;
        }

        public void setReporter_id(String reporter_id) {
            this.reporter_id = reporter_id;
        }

        public String getReporter_name() {
            return reporter_name;
        }

        public void setReporter_name(String reporter_name) {
            this.reporter_name = reporter_name;
        }

        public String getReported_id() {
            return reported_id;
        }

        public void setReported_id(String reported_id) {
            this.reported_id = reported_id;
        }

        public String getReported_name() {
            return reported_name;
        }

        public void setReported_name(String reported_name) {
            this.reported_name = reported_name;
        }

        public LocalDateTime getCreated_at() {
            return created_at;
        }

        public void setCreated_at(LocalDateTime created_at) {
            this.created_at = created_at;
        }

        public String getPost_content() {
            return post_content;
        }

        public void setPost_content(String post_content) {
            this.post_content = post_content;
        }
    }

    public String getpost_Id() {
        return post_id;
    }

    public void setpost_Id(String post_Id) {
        this.post_id = post_Id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public Long getReport_count() {
        return report_count;
    }

    public void setReport_count(Long report_count) {
        this.report_count = report_count;
    }

    public int getLike_count() {
        return like_count;
    }

    public void setLike_count(int like_count) {
        this.like_count = like_count;
    }

    public int getView_count() {
        return view_count;
    }

    public void setView_count(int view_count) {
        this.view_count = view_count;
    }

    public List<String> getHash_tags() {
        return hash_tags;
    }

    public void setHash_tags(List<String> hash_tags) {
        this.hash_tags = hash_tags;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPost_content() {
        return post_content;
    }

    public void setPost_content(String post_content) {
        this.post_content = post_content;
    }

    public String getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(String updated_at) {
        this.updated_at = updated_at;
    }

    public int getComment_count() {
        return comment_count;
    }

    public void setComment_count(int comment_count) {
        this.comment_count = comment_count;
    }

    public List<String> getPost_images() {
        return post_images;
    }

    public void setPost_images(List<String> post_images) {
        this.post_images = post_images;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }
}
