package com.example.userauth.repository;

import com.example.userauth.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // 이메일 중복 체크를 위한 메서드 추가
    boolean existsByEmail(String email);

    Optional<Admin> findByEmail(String email);  // 이메일로 회원 찾기

    Optional<Admin> findById(Long id);
}
