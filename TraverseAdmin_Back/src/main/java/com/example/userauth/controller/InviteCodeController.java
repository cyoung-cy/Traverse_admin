package com.example.userauth.controller;

import com.example.userauth.dto.request.InviteCodeValidationRequest;
import com.example.userauth.dto.response.InviteCodeValidationResponse;
import com.example.userauth.model.InviteCode;
import com.example.userauth.service.InviteCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/invite-code")
public class InviteCodeController {

    @Autowired
    private InviteCodeService inviteCodeService;

    // 관리자 초대 코드 생성 API
    @PostMapping("/generate")
    public ResponseEntity<?> generateInviteCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.get("role");
        System.out.println("받은 역할: " + role);

        InviteCode inviteCode = inviteCodeService.generateInviteCode(email, role);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of(
                "code", inviteCode.getCode(),
                "expires_at", inviteCode.getExpiresAt()
        ));
        response.put("message", "초대 코드 생성 완료");

        return ResponseEntity.ok(response);
    }

    // 초대 코드 검증 API
    @PostMapping("/validate")
    public ResponseEntity<InviteCodeValidationResponse> validateInviteCode(@RequestBody InviteCodeValidationRequest request) {
        InviteCodeValidationResponse response = inviteCodeService.validateInviteCode(request.getCode());
        System.out.println(response);
        return ResponseEntity.ok(response);
    }
}

