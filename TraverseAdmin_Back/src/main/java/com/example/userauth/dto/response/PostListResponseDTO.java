package com.example.userauth.dto.response;

import lombok.Getter;

import java.util.List;

@Getter
public class PostListResponseDTO {
    private boolean success;
    private List<PostResponseDTO> posts;
    private long total_count;
    private int current_page;
    private int total_pages;

    public PostListResponseDTO(List<PostResponseDTO> posts, long total_count, int current_page, int total_pages) {
        this.success = true;
        this.posts = posts;
        this.total_count = total_count;
        this.current_page = current_page;
        this.total_pages = total_pages;
    }
}
