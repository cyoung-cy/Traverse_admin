package com.example.userauth.controller;

import com.example.userauth.dto.request.LoginRequest;
import com.example.userauth.dto.request.RegisterRequest;
import com.example.userauth.dto.response.AdminResponseDTO;
import com.example.userauth.dto.response.AdminSummary;
import com.example.userauth.dto.response.ApiResponse;
import com.example.userauth.model.Admin;
import com.example.userauth.security.JwtTokenProvider;
import com.example.userauth.service.AuthService;
import com.example.userauth.service.JwtTokenService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtTokenService jwtTokenService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthController(JwtTokenService jwtTokenService, JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenService = jwtTokenService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 회원가입 API
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);

            // 응답 데이터를 Map으로 구성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입 성공");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 로그인 성공 시 로그인 응답 객체 반환
            ApiResponse response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(response);  // ApiResponse에 LoginResponse가 포함된 상태로 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, e.getMessage()));
        }
    }

    // 관리자 목록 조회 API (이름과 role만 반환)
    @GetMapping("/admins")
    public ResponseEntity<Map<String, Object>> getAllAdmins() {
        List<AdminSummary> admins = authService.getAllAdminSummaries();
        long totalCount = authService.getAdminCount();  // count를 반환하는 메서드 추가 필요

        Map<String, Object> response = new HashMap<>();
        response.put("admins", admins);
        response.put("total_count", totalCount);

        return ResponseEntity.ok(response);
    }


    // 관리자 상세 정보 조회 API
    @GetMapping("/admins/{adminId}")
    public ResponseEntity<?> getAdminById(@PathVariable Long adminId) {
        try {
            if (adminId == null || adminId.equals("undefined")) {
                return ResponseEntity.badRequest().body("Invalid admin ID");
            }

            Admin admin = authService.getAdminById(adminId);

            // AdminResponseDTO 형식으로 변환
            AdminResponseDTO response = new AdminResponseDTO(
                    true, // success
                    new AdminResponseDTO.AdminData(
                            admin.getId(),
                            admin.getName(),
                            admin.getEmail(),
                            admin.getRole(),
                            List.of("VIEW_DASHBOARD", "MANAGE_USERS"), // 권한 (예제)
                            admin.getStatus(),
                            admin.getLast_login_at(),
                            new Timestamp(System.currentTimeMillis()), // created_at (DB에서 가져와야 함)
                            new Timestamp(System.currentTimeMillis()), // updated_at (DB에서 가져와야 함)
                            List.of(
                                    new AdminResponseDTO.ActivityLog(
                                            "LOGIN",
                                            new Timestamp(System.currentTimeMillis()),
                                            Map.of("ip", "192.168.0.1") // 임시 데이터
                                    )
                            )
                    )
            );

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

}

