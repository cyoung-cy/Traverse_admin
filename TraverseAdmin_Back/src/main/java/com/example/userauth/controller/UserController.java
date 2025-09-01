package com.example.userauth.controller;

import com.example.userauth.dto.request.UserStatusUpdateRequest;
import com.example.userauth.dto.response.ApiResponse;
import com.example.userauth.dto.response.UserListResponse;
import com.example.userauth.model.User;
import com.example.userauth.service.UserService;
import com.example.userauth.service.UserStatisticsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    private UserStatisticsService userStatisticsService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 사용자 목록 조회 API
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        UserListResponse userListResponse = userService.getAllUsers(page, limit, search, status, sortBy, sortOrder);
        List<User> users = userListResponse.getUsers();  // Extract users from the response

        int totalCount = userService.getTotalUserCount();
        int totalPages = (totalCount + limit - 1) / limit;

        // 응답 데이터 가공
        List<Map<String, Object>> userData = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("user_id", user.getUser_id());
            userMap.put("user_name", user.getUser_name());
            userMap.put("email", user.getEmail());
            userMap.put("verify", user.getVerify());
            userMap.put("created_at", user.getCreated_at());
            userMap.put("last_login_at", user.getLast_login_at());
            userMap.put("report_count", user.getReport_count());
            userMap.put("country_code", user.getCountry_code());
            userMap.put("status", user.getStatus());
            return userMap;
        }).collect(Collectors.toList());

        // 응답 구조
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("users", userData);
        response.put("total_count", totalCount);
        response.put("current_page", page);
        response.put("total_pages", totalPages);

        return ResponseEntity.ok(response);
    }

    // 사용자 통계 대시보드 데이터 API
    @GetMapping("/statistics")
    public Map<String, Object> getUserStatistics(
            @RequestParam String start_date,
            @RequestParam String end_date,
            @RequestParam String interval) {
        return userStatisticsService.getUserStatistics(start_date, end_date, interval);
    }


    // 사용자 상세 정보 조회 API
    @GetMapping("/{userId}")
    public ResponseEntity<Object> getUserDetails(@PathVariable String userId) {
        User user = userService.getUserDetailById(userId);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

    //오류 처리 API
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleExceptions(Exception e) {
        return ResponseEntity
                .status(500)
                .body(Map.of("success", false, "error", "서버 오류: " + e.getMessage()));
    }

    // 사용자 계정 상태 변경 API
    @PatchMapping("/{user_id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String user_id,
            @RequestBody @Valid UserStatusUpdateRequest userStatusUpdateRequest) {
        // Request Body 출력
        System.out.println("Request Body:");
        System.out.println("Status: " + userStatusUpdateRequest.getStatus());
        System.out.println("Reason: " + userStatusUpdateRequest.getReason());
        System.out.println("Duration Days: " + userStatusUpdateRequest.getDurationDays());

        try {
            String message = userService.updateUserStatus(
                    user_id,
                    userStatusUpdateRequest.getStatus(),
                    userStatusUpdateRequest.getReason(),
                    userStatusUpdateRequest.getDurationDays()
            );

            // Response 출력
            ApiResponse response = new ApiResponse(true, message);
            System.out.println("Response:");
            System.out.println("Success: " + response.isSuccess());
            System.out.println("Message: " + response.getMessage());


            return ResponseEntity.ok(new ApiResponse(true, message));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // 사용자 탈퇴 사유 통계 API
    @GetMapping("/withdrawal-reasons")
    public ResponseEntity<Map<String, Object>> getWithdrawalReasons(
            @RequestParam String start_date,
            @RequestParam String end_date) {
        try {
            Map<String, Object> response = userService.getWithdrawalReasons(start_date, end_date);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "서버 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

}
