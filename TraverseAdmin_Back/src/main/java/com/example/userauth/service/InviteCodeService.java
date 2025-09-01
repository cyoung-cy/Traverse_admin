package com.example.userauth.service;

import com.example.userauth.dto.response.InviteCodeValidationResponse;
import com.example.userauth.model.InviteCode;
import com.example.userauth.repository.InviteCodeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class InviteCodeService {

    @Autowired
    private InviteCodeRepository inviteCodeRepository;

    private static final String[] VALID_ROLES = {
            "chief_manager", "post_manager", "chat_manager", "user_manager", "data_manager"
    };

    // 초대 코드 생성 메서드
    public InviteCode generateInviteCode(String email, String role) {

        // 역할이 유효한지 체크
        if (!isValidRole(role)) {
            throw new IllegalArgumentException("유효하지 않은 역할입니다.");
        }

        // 고유한 코드 생성 (예: UUID 사용)
        String code = UUID.randomUUID().toString();

        // 만료 시간 설정 (예: 24시간 후)
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

        // InviteCode 객체 생성
        InviteCode inviteCode = new InviteCode();
        inviteCode.setCode(code);
        inviteCode.setRole(role);
        inviteCode.setEmail(email); // ✅ 초대코드에 이메일 저장
        inviteCode.setExpiresAt(expiresAt);

        System.out.println("Saved invite code: " + inviteCode);  // 로그로 확인

        // 데이터베이스에 초대 코드 저장
        inviteCodeRepository.save(inviteCode);

        return inviteCode;
    }

    // 유효한 역할인지 체크하는 메서드
    private boolean isValidRole(String role) {
        for (String validRole : VALID_ROLES) {
            if (validRole.equals(role)) {
                return true;
            }
        }
        return false;
    }

    public InviteCodeValidationResponse validateInviteCode(String code) {
        Optional<InviteCode> inviteCodeOpt = inviteCodeRepository.findByCode(code);

        if (inviteCodeOpt.isEmpty()) {
            return new InviteCodeValidationResponse(false, null, "초대 코드가 존재하지 않습니다.");
        }

        InviteCode inviteCode = inviteCodeOpt.get();

        if (inviteCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new InviteCodeValidationResponse(false, null, "초대 코드가 만료되었습니다.");
        }

        InviteCodeValidationResponse.Data data = new InviteCodeValidationResponse.Data(
                true,
                inviteCode.getRole(),
                inviteCode.getEmail() // ✅ 초대 이메일 전달
        );
        return new InviteCodeValidationResponse(true, data, inviteCode.getRole() + " 권한으로 인증된 유효한 코드입니다.");
    }


    @Scheduled(fixedRate = 86400000)  // 24시간(86400000ms)마다 실행
    public void deleteExpiredInviteCodes() {
        LocalDateTime now = LocalDateTime.now();
        inviteCodeRepository.deleteByExpiresAtBefore(now);  // 만료된 인증 코드 삭제
    }

}
