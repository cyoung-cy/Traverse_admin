package com.example.userauth.service;

import com.example.userauth.dto.request.RegisterRequest;
import com.example.userauth.dto.response.AdminSummary;
import com.example.userauth.dto.response.ApiResponse;
import com.example.userauth.dto.response.LoginResponse;
import com.example.userauth.model.Admin;
import com.example.userauth.model.InviteCode;
import com.example.userauth.repository.AdminRepository;
import com.example.userauth.repository.InviteCodeRepository;
import com.example.userauth.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private InviteCodeRepository inviteCodeRepository;

    @Autowired
    private final JwtTokenProvider jwtTokenProvider; // 🔹 JWT 토큰 프로바이더 추가

    @Autowired
    public AuthService(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;

    }

    // 비밀번호 암호화 및 사용자 등록 처리
    public boolean register(RegisterRequest registerRequest) {
        if (adminRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        // 초대코드로 역할 가져오기
        Optional<InviteCode> inviteCode = inviteCodeRepository.findByCode(registerRequest.getInvite_code());
        if (inviteCode.isEmpty()) {
            throw new RuntimeException("유효하지 않은 초대 코드입니다.");
        }

        String role = inviteCode.get().getRole();

        Admin admin = new Admin();
        admin.setName(registerRequest.getName());
        admin.setEmail(registerRequest.getEmail());
        admin.setPassword(encodedPassword);
        admin.setPasswordConfirm(encodedPassword);
        admin.setInvitecode(registerRequest.getInvite_code());
        admin.setRole(role);

        adminRepository.save(admin);
        return true;
    }



    // 로그인 로직 (비밀번호 검증 등)
    public ApiResponse login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (passwordEncoder.matches(password, admin.getPassword())) {
            String token = jwtTokenProvider.generateToken(admin);
            LoginResponse loginResponse = new LoginResponse(true, "로그인 성공", admin.getEmail(), admin.getName(), token, String.valueOf(admin.getId()), admin.getRole());
            return new ApiResponse(true, "로그인 성공", loginResponse);
        } else {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
    }


    // 관리자 목록 조회 (이름과 role만 반환)
    public List<AdminSummary> getAllAdminSummaries() {
        List<Admin> admins = adminRepository.findAll();
        List<AdminSummary> adminSummaries = new ArrayList<>();

        for (Admin admin : admins) {
            AdminSummary summary =
                    new AdminSummary(admin.getName(), admin.getRole(), admin.getId(), admin.getEmail(), admin.getStatus(), admin.getLast_login_at());
            adminSummaries.add(summary);
        }

        return adminSummaries;
    }

    // 관리자 상세 정보 조회
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found with id " + id));
    }

    public long getAdminCount() {
        return adminRepository.count();
    }
}
