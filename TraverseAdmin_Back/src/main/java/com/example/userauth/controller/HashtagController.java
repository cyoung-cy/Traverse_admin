package com.example.userauth.controller;

import com.example.userauth.model.Hashtag;
import com.example.userauth.service.HashtagService;
import com.google.cloud.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
public class HashtagController {

    private final HashtagService hashtagService;

    @Autowired
    public HashtagController(HashtagService hashtagService) {
        this.hashtagService = hashtagService;
    }

    //해시태그 목록 조회 API
    @GetMapping("/api/hashtags")
    public ResponseEntity<Map<String, Object>> getHashtags(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "usage_count") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "all") String type) {

        // 데이터베이스에서 해시태그 목록을 조회하는 코드로 변경
        List<Hashtag> hashtagsFromDb = hashtagService.getHashtags(page, limit, search, sortBy, sortOrder, type);

        // 실제 해시태그 데이터를 변환하여 응답 형식에 맞게 설정
        List<Map<String, Object>> hashtags = new ArrayList<>();
        for (Hashtag hashtag : hashtagsFromDb) {
            Map<String, Object> hashtagMap = new HashMap<>();
            hashtagMap.put("id", hashtag.getId());
            hashtagMap.put("name", hashtag.getName());
            hashtagMap.put("usage_count", hashtag.getUsage_count());
            hashtagMap.put("created_at", convertToTimestamp(hashtag.getCreated_at())); // 실제 DB의 timestamp 사용
            hashtagMap.put("last_used_at", convertToTimestamp(hashtag.getLast_used_at())); // 실제 DB의 timestamp 사용
            hashtagMap.put("trend", hashtag.getTrend()); // 실제 DB에서 trend 가져오기

            hashtags.add(hashtagMap);
        }

        // 전체 결과를 위한 메타데이터 계산
        int totalCount = hashtagService.getTotalHashtagsCount(); // Firestore에서 해시태그 총 개수 조회
        int totalPages = (int) Math.ceil((double) totalCount / limit);
        int currentPage = page;

        // 응답 구조 생성
        Map<String, Object> response = new HashMap<>();
        response.put("hashtags", hashtags); // hashtags를 최상위에 넣음
        response.put("total_count", totalCount);
        response.put("current_page", currentPage);
        response.put("total_pages", totalPages);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }


    // 해시태그 상세 조회 API
    @GetMapping("/api/hashtags/{hashtag_id}")
    public ResponseEntity<Map<String, Object>> getHashtagDetails(@PathVariable String hashtag_id) {
        Hashtag hashtagDetails = hashtagService.getHashtagDetails(hashtag_id);

        if (hashtagDetails == null) {
            return ResponseEntity.notFound().build();
        }

        // 트렌드 데이터 조회 (더미 데이터 예제)
        List<Map<String, Object>> trendData = hashtagService.getTrendData(hashtag_id);

        // 인기 게시글 조회 (더미 데이터 예제)
        List<Map<String, Object>> topPosts = hashtagService.getTopPosts(hashtag_id);

        // 연관 해시태그 조회
        List<Hashtag.RelatedHashtag> relatedHashtagsRaw = hashtagService.getRelatedHashtags(hashtagDetails.getName());


        // 상세 정보를 응답 형식에 맞게 변환
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();

        data.put("id", hashtagDetails.getId());
        data.put("name", hashtagDetails.getName());
        data.put("usage_count", hashtagDetails.getUsage_count());
        data.put("created_at", hashtagDetails.getCreated_at().toString());
        data.put("last_used_at", hashtagDetails.getLast_used_at().toString());
        data.put("trend", hashtagDetails.getTrend());
        data.put("related_hashtags", relatedHashtagsRaw);
        data.put("trend_data", trendData);  // ✔ 트렌드 데이터 포함
        data.put("top_posts", topPosts);  // ✔ 인기 게시글 포함
        response.put("success", true);
        response.put("data", data);

        return ResponseEntity.ok(response);

    }

    // timestamp 변환 메서드 (Firestore Timestamp -> ISO 8601 형식으로 변환)
    private String convertToTimestamp(Timestamp timestamp) {
        if (timestamp == null) {
            return null; // null인 경우 처리
        }
        Instant instant = timestamp.toDate().toInstant();
        return instant.toString(); // ISO 8601 형식 (예: 2025-03-27T16:35:48Z)
    }

    // 해시태그 워드 클라우드 API
    @GetMapping("/api/hashtags/wordcloud")
    public ResponseEntity<Map<String, Object>> getHashtagWordCloud(
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "day") String period) {

        // 워드 클라우드 데이터를 가져오는 서비스 메서드 호출
        List<Map<String, Object>> wordCloudData = hashtagService.getHashtagWordCloud(period, limit);

        // 응답 구조 생성
        // 응답 구조 생성 (중첩된 data 제거)
        Map<String, Object> response = Map.of(
                "success", true,
                "hashtags", wordCloudData // data 중첩 제거
        );

        return ResponseEntity.ok(response);
    }

    // 해시태그 상태 변경 API
    @PatchMapping("/api/hashtags/{hashtag_id}/status")
    public ResponseEntity<Map<String, Object>> updateHashtagStatus(
            @PathVariable String hashtag_id,
            @RequestBody Map<String, String> requestBody) {

        String status = requestBody.get("status");  // "active", "blocked", "featured"
        String reason = requestBody.get("reason");

        // 해시태그 상태 변경 서비스 호출
        boolean isUpdated = hashtagService.updateHashtagStatus(hashtag_id, status, reason);

        Map<String, Object> response = new HashMap<>();
        if (isUpdated) {
            response.put("success", true);
            response.put("message", "해시태그 상태가 변경되었습니다");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "해시태그 상태 변경에 실패했습니다");
            return ResponseEntity.status(400).body(response); // 실패시 400 Bad Request
        }
    }

    // 해시태그 통계 대시보드 API
    @GetMapping("/api/hashtags/statistics")
    public ResponseEntity<Map<String, Object>> getHashtagStatistics(
            @RequestParam String start_date,
            @RequestParam String end_date) throws ExecutionException, InterruptedException, ParseException {

        // HashtagService에서 통계 데이터를 가져옴
        Map<String, Object> statistics = hashtagService.getHashtagStatistics(start_date, end_date);

        // 응답 반환
        return ResponseEntity.ok(statistics);
    }

}
