package com.example.userauth.controller;

import com.example.userauth.dto.request.PostStatusUpdateRequest;
import com.example.userauth.dto.response.PostListResponseDTO;
import com.example.userauth.dto.response.PostResponseDTO;
import com.example.userauth.dto.response.PostStatusUpdateResponseDTO;
import com.example.userauth.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 게시물 목록 조회 API
    @GetMapping
    public PostListResponseDTO getPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String user_id,
            @RequestParam(defaultValue = "create_at") String sort_by,
            @RequestParam(defaultValue = "desc") String sort_order,
            @RequestParam(required = false) Boolean has_reports) throws ExecutionException, InterruptedException {

        return postService.getPosts(page, limit, status, search, user_id, sort_by, sort_order, has_reports);
    }

    // 게시물 상세 조회 API
    @GetMapping("/{post_id}")
    public ResponseEntity<PostResponseDTO> getPostDetail(@PathVariable String post_id) throws ExecutionException, InterruptedException {
        PostResponseDTO postDetail = postService.getPostDetail(post_id);
        return ResponseEntity.ok(postDetail);
    }

    // 게시물 상태 변경 API
    @PatchMapping("/{post_id}/status")
    public ResponseEntity<PostStatusUpdateResponseDTO> updatePostStatus(
            @PathVariable String post_id,
            @RequestBody PostStatusUpdateRequest request) throws ExecutionException, InterruptedException {

        postService.updatePostStatus(post_id, request);

        PostStatusUpdateResponseDTO response = new PostStatusUpdateResponseDTO(true, "게시물 상태가 변경되었습니다");
        return ResponseEntity.ok(response);
    }

    // 신고 검토 대기 목록 조회 API
    @GetMapping("/pending-reviews")
    public ResponseEntity<Map<String, Object>> getPendingReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) throws ExecutionException, InterruptedException {
        Map<String, Object> pendingReviews = postService.getPendingReviews(page, limit);
        return ResponseEntity.ok(pendingReviews);
    }

    // 게시물 통계 대시보드 데이터 API
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPostsStatistics(
            @RequestParam(required = false) String start_date,
            @RequestParam(required = false) String end_date,
            @RequestParam(required = false) String interval) throws ExecutionException, InterruptedException, ParseException {
        Map<String, Object> statistics = postService.getPostsStatistics(start_date, end_date, interval);
        return ResponseEntity.ok(statistics);
    }
}

