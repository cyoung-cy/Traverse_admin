package com.example.userauth.service;

import com.example.userauth.dto.request.RoleUpdateRequest;
import com.example.userauth.model.Admin;
import com.example.userauth.repository.AdminRepository;
import com.example.userauth.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JwtTokenProvider 주입

    // 관리자 역할 및 권한 변경
    public boolean updateAdminRole(Long adminId, RoleUpdateRequest request, String token) {
        // 토큰에서 사용자 정보 파싱
        String requesterEmail = jwtTokenProvider.getEmailFromToken(token);

        // 요청한 사용자가 "최상위 관리자"인지 확인
        Optional<Admin> requesterAdminOpt = adminRepository.findByEmail(requesterEmail);
        // 콘솔에 요청자의 이메일과 역할 정보 출력
        if (requesterAdminOpt.isEmpty()) {
            System.out.println("해당 이메일로 관리자를 찾을 수 없습니다: " + requesterEmail);
        } else {
            Admin requesterAdmin = requesterAdminOpt.get();
            System.out.println("요청한 관리자 정보: 이메일 = " + requesterAdmin.getEmail() + ", 역할 = " + requesterAdmin.getRole());
        }

        if (requesterAdminOpt.isEmpty() || !"chief_manager".equals(requesterAdminOpt.get().getRole())) {
            return false; // 권한 없음
        }
        // 변경할 관리자 정보 조회
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new EntityNotFoundException("해당 ID의 관리자를 찾을 수 없습니다."));

        // 역할 변경 적용
        admin.setRole(request.getRole());
        adminRepository.save(admin);
        return true;
    }

    // 관리자 상태 변경 메서드
    public boolean updateAdminStatus(Long adminId, RoleUpdateRequest request, String token) {
        // 토큰에서 사용자 정보 파싱
        String requesterEmail = jwtTokenProvider.getEmailFromToken(token);

        // 요청한 사용자가 "최상위 관리자"인지 확인
        Optional<Admin> requesterAdminOpt = adminRepository.findByEmail(requesterEmail);
        // 콘솔에 요청자의 이메일과 역할 정보 출력
        if (requesterAdminOpt.isEmpty()) {
            System.out.println("해당 이메일로 관리자를 찾을 수 없습니다: " + requesterEmail);
        } else {
            Admin requesterAdmin = requesterAdminOpt.get();
            System.out.println("요청한 관리자 정보: 이메일 = " + requesterAdmin.getEmail() + ", 역할 = " + requesterAdmin.getRole());
        }

        if (requesterAdminOpt.isEmpty() || !"chief_manager".equals(requesterAdminOpt.get().getRole())) {
            return false; // 권한 없음
        }

        // 상태 변경할 관리자 정보 조회
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new EntityNotFoundException("해당 ID의 관리자를 찾을 수 없습니다."));

        // 관리자 상태 변경 적용
        admin.setStatus(request.getStatus());  // 상태 변경
        adminRepository.save(admin);
        return true;
    }

}
