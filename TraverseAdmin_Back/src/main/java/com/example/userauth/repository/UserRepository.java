package com.example.userauth.repository;

import com.example.userauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> { // <User, String>로 수정
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(String userId); // userId로 사용자 찾기
}
