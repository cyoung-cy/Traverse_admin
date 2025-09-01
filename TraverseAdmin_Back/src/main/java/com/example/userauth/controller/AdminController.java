package com.example.userauth.controller;

import com.example.userauth.dto.request.RoleUpdateRequest;
import com.example.userauth.dto.response.ApiResponse;
import com.example.userauth.model.ActivityLog;
import com.example.userauth.security.JwtTokenProvider;
import com.example.userauth.service.ActivityLogService;
import com.example.userauth.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JwtTokenProvider 주입

    // 관리자 역할 및 권한 변경 API
    @PatchMapping("/{admin_id}/role")
    public ResponseEntity<ApiResponse> updateAdminRole(
            @PathVariable("admin_id") Long adminId,
            @RequestBody RoleUpdateRequest request,
            @RequestHeader("Authorization") String token) {

        try {
            // JWT 토큰에서 admin 이메일 추출
            String adminEmail = jwtTokenProvider.getUsernameFromToken(token);

            // 관리자 권한 확인
            if (!jwtTokenProvider.hasAdminRole(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, "권한이 없습니다."));
            }

            // 관리자 권한이 있으면 역할 업데이트
            boolean success = adminService.updateAdminRole(adminId, request, adminEmail);
            if (success) {
                return ResponseEntity.ok(new ApiResponse(true, "관리자 역할이 변경되었습니다"));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, "관리자 정보가 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    // 관리자 상태 변경 API
    @PatchMapping("/{admin_id}/status")
    public ResponseEntity<ApiResponse> updateAdminStatus(
            @PathVariable("admin_id") Long adminId,
            @RequestBody RoleUpdateRequest request, // 상태 변경을 위한 request 객체
            @RequestHeader("Authorization") String token) {

        try {
            // JWT 토큰에서 admin 이메일 추출
            String adminEmail = jwtTokenProvider.getUsernameFromToken(token);

            // 관리자 권한 확인
            if (!jwtTokenProvider.hasAdminRole(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, "권한이 없습니다."));
            }

            // 관리자 권한이 있으면 상태 업데이트
            boolean success = adminService.updateAdminStatus(adminId, request, adminEmail);
            if (success) {
                return ResponseEntity.ok(new ApiResponse(true, "관리자 상태가 변경되었습니다"));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, "관리자 정보가 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    // 관리자 활동 로그 조회 API
    @GetMapping("/activity-log")
    public ResponseEntity<ApiResponse> getActivityLogs(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "50") int limit,
            @RequestParam(value = "admin_id", required = false) Long adminId,
            @RequestParam(value = "action", required = false) String action,
            @RequestParam(value = "start_date", required = false) String startDate,
            @RequestParam(value = "end_date", required = false) String endDate) {

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate start = (startDate != null) ? LocalDate.parse(startDate, formatter) : null;
            LocalDate end = (endDate != null) ? LocalDate.parse(endDate, formatter) : null;

            // 날짜가 제공되면 LocalDateTime으로 변환
            LocalDateTime startDateTime = (start != null) ? start.atStartOfDay() : null;
            LocalDateTime endDateTime = (end != null) ? end.atTime(23, 59, 59) : null;

            // 활동 로그 조회
            List<ActivityLog> logs = activityLogService.getActivityLogs(adminId, action, startDateTime, endDateTime);

            // 총 갯수와 페이지 정보 처리
            int total_count = logs.size();
            int current_page = (int) Math.ceil((double) total_count / limit);
            int total_pages = page;

            // `data` 필드를 포함한 Map 생성
            Map<String, Object> data = new HashMap<>();
            data.put("logs", logs);
            data.put("total_count", total_count);
            data.put("current_page", current_page);
            data.put("total_pages", total_pages);

            // `ApiResponse`에 `data` 객체를 담아서 반환
            ApiResponse response = new ApiResponse(true, "활동 로그 조회 성공", data);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(false, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

}