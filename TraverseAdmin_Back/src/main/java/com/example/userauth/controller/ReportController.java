package com.example.userauth.controller;

import com.google.cloud.firestore.*;
import com.example.userauth.dto.response.ApiResponse;
import com.example.userauth.dto.response.ReportDTO;
import com.example.userauth.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final Firestore firestore;

    @Autowired
    public ReportController(ReportService reportService, Firestore firestore) {
        this.firestore = firestore;
        this.reportService = reportService;
    }

    // 사용자 신고 목록 조회 API
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        return getReportsForType("user", page, limit, search, status, sortBy, sortOrder);
    }

    // 게시물 신고 목록 조회 API
    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getPostReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        return getReportsForType("post", page, limit, search, status, sortBy, sortOrder);
    }

    // 채팅 신고 목록 조회 API
    @GetMapping("/chats")
    public ResponseEntity<Map<String, Object>> getChatReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        return getReportsForType("chat", page, limit, search, status, sortBy, sortOrder);
    }

    // 기존에 있던 다른 신고 목록 조회 API와 동일하게 처리
    @GetMapping("/snaps")
    public ResponseEntity<Map<String, Object>> getSnapReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        return getReportsForType("snap", page, limit, search, status, sortBy, sortOrder);
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getCommentReports(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @RequestParam(value = "status", defaultValue = "all") String status,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sort_by", defaultValue = "created_at") String sortBy,
            @RequestParam(value = "sort_order", defaultValue = "desc") String sortOrder) {

        try {
            Map<String, Object> data = reportService.getCommentReports(page, limit, status, search, sortBy, sortOrder);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // 공통된 처리 로직
    private ResponseEntity<Map<String, Object>> getReportsForType(
            String type, int page, int limit, String search, String status, String sortBy, String sortOrder) {
        try {
            Map<String, Object> response;

            if ("user".equals(type)) {
                response = reportService.getReportsSummary("user", page, limit, search, status, sortBy, sortOrder);
            } else if ("post".equals(type)) {
                response = reportService.getReportsSummary("post", page, limit, search, status, sortBy, sortOrder);
            } else if ("chat".equals(type)) {
                response = reportService.getReportsSummary("chat", page, limit, search, status, sortBy, sortOrder);
            } else if ("snap".equals(type)) {
                response = reportService.getReportsSummary("snap", page, limit, search, status, sortBy, sortOrder);
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "유효하지 않은 신고 타입입니다."));
            }

            response.put("success", true);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "서버 오류: " + e.getMessage()));
        }
    }



    // 신고 상세 조회 API
    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReportDetail(@PathVariable String reportId) {
        try {
            DocumentSnapshot reportSnapshot = firestore.collection("reports").document(reportId).get().get();

            if (!reportSnapshot.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("신고 정보를 찾을 수 없습니다.");
            }

            String reportType = reportSnapshot.getString("report_type");
            boolean postExists = true;

            if ("post".equals(reportType)) {
                String postId = reportSnapshot.getString("post_id");
                if (postId != null) {
                    DocumentSnapshot postSnapshot = firestore.collection("Post").document(postId).get().get();
                    postExists = postSnapshot.exists();
                }
            }

            Map<String, Object> data = reportSnapshot.getData();
            data.put("post_exists", postExists);

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }



    // 신고 상태 업데이트 API
    @PatchMapping("/{report_id}/status")
    public ResponseEntity<Object> updateReportStatus(
            @PathVariable String reportId,
            @RequestBody Map<String, String> statusUpdateRequest) {
        try {
            String status = statusUpdateRequest.get("status");
            String reason = statusUpdateRequest.get("reason");

            // 상태 업데이트
            String message = reportService.updateReportStatus(reportId, status, reason);

            return ResponseEntity.ok(new ApiResponse(true, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // 신고 처리 API
    @PatchMapping("/{reportId}/process")
    public String processReport(
            @PathVariable String reportId,
            @RequestBody Map<String, Object> requestMap
    ) {
        String status = (String) requestMap.get("status");
        String actionTaken = (String) requestMap.get("action_taken");
        String comment = (String) requestMap.get("comment");
        boolean notifyReporter = requestMap.get("notify_reporter") != null && (Boolean) requestMap.get("notify_reporter");
        boolean notifyReported = requestMap.get("notify_reported") != null && (Boolean) requestMap.get("notify_reported");
        Integer suspensionDuration = requestMap.get("suspension_duration") != null ? ((Number) requestMap.get("suspension_duration")).intValue() : null;
        boolean deletePost = requestMap.get("delete_post") != null && (Boolean) requestMap.get("delete_post");

        return reportService.processReport(reportId, status, actionTaken, comment, notifyReporter, notifyReported, suspensionDuration, deletePost);
    }

    // 오류 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleExceptions(Exception e) {
        return ResponseEntity
                .status(500)
                .body(Map.of("success", false, "error", "서버 오류: " + e.getMessage()));
    }




}
