package com.example.userauth.model;

import com.google.cloud.Timestamp;

import java.util.ArrayList;
import java.util.List;

public class Hashtag {

    private String id;
    private String name;
    private int usage_count;
    private Timestamp created_at;
    private Timestamp last_used_at;
    private String trend;
    private List<TrendData> trend_data = new ArrayList<>(); // 추가: trend_data
    private List<RelatedHashtag> related_hashtags = new ArrayList<>(); // 추가: related_hashtags
    private List<TopPost> top_posts = new ArrayList<>(); // 추가: top_posts
    private String status;  // 상태: active, blocked, featured
    private String reason;  // 상태 변경 이유
    // 기본 생성자
    public Hashtag() {
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getUsage_count() {
        return usage_count;
    }

    public void setUsage_count(int usage_count) {
        this.usage_count = usage_count;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getLast_used_at() {
        return last_used_at;
    }

    public void setLast_used_at(Timestamp last_used_at) {
        this.last_used_at = last_used_at;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public List<TrendData> getTrend_data() {
        return trend_data;
    }

    public void setTrend_data(List<TrendData> trend_data) {
        this.trend_data = trend_data;
    }

    public List<RelatedHashtag> getRelated_hashtags() {
        return related_hashtags;
    }

    public void setRelated_hashtags(List<RelatedHashtag> related_hashtags) {
        this.related_hashtags = related_hashtags;
    }

    public List<TopPost> getTop_posts() {
        return top_posts;
    }

    public void setTop_posts(List<TopPost> top_posts) {
        this.top_posts = top_posts;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    // 모든 필드를 포함하는 생성자
    public Hashtag(String id, String name, int usage_count, Timestamp created_at, Timestamp last_used_at, String trend, List<TrendData> trend_data,
                   List<RelatedHashtag> related_hashtags, List<TopPost> top_posts
    , String status, String reason) {
        this.id = id;
        this.name = name;
        this.usage_count = usage_count;
        this.created_at = created_at;
        this.last_used_at = last_used_at;
        this.trend = trend;
        this.trend_data = trend_data;
        this.related_hashtags = related_hashtags;
        this.top_posts = top_posts;
        this.status = status;
        this.reason = reason;

    }

    public static class TrendData {
        private String date;
        private int count;

        // 기본 생성자, getters, setters (생략)
        public TrendData() {
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    public static class RelatedHashtag {
        private String id;
        private String name;
        private int usage_count;
        private float correlation;

        // 기본 생성자, getters, setters (생략)
        public RelatedHashtag() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getUsage_count() {
            return usage_count;
        }

        public void setUsage_count(int usage_count) {
            this.usage_count = usage_count;
        }

        public float getCorrelation() {
            return correlation;
        }

        public void setCorrelation(float correlation) {
            this.correlation = correlation;
        }
    }

    public static class TopPost {
        private String post_id;
        private String title;
        private int like_count;

        // 기본 생성자, getters, setters (생략)
        public TopPost() {

        }

        public String getPost_id() {
            return post_id;
        }

        public void setPost_id(String post_id) {
            this.post_id = post_id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getLike_count() {
            return like_count;
        }

        public void setLike_count(int like_count) {
            this.like_count = like_count;
        }
    }

}
