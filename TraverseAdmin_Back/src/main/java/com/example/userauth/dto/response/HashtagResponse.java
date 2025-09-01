package com.example.userauth.dto.response;

import com.example.userauth.model.Hashtag;

import java.util.List;

public class HashtagResponse {
    private boolean success;
    private HashtagData data;

    // Getter, Setter


    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public HashtagData getData() {
        return data;
    }

    public void setData(HashtagData data) {
        this.data = data;
    }
}

class HashtagData {
    private List<Hashtag> hashtags;
    private int current_page;
    private int total_count;
    private int total_pages;

    // Constructor, Getter, Setter


    public List<Hashtag> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<Hashtag> hashtags) {
        this.hashtags = hashtags;
    }

    public int getCurrent_page() {
        return current_page;
    }

    public void setCurrent_page(int current_page) {
        this.current_page = current_page;
    }

    public int getTotal_count() {
        return total_count;
    }

    public void setTotal_count(int total_count) {
        this.total_count = total_count;
    }

    public int getTotal_pages() {
        return total_pages;
    }

    public void setTotal_pages(int total_pages) {
        this.total_pages = total_pages;
    }
}