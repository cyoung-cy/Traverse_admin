package com.example.userauth.repository;

import com.example.userauth.model.InviteCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface InviteCodeRepository extends JpaRepository<InviteCode, Long> {
    Optional<InviteCode> findByCode(String code);
    void deleteByExpiresAtBefore(LocalDateTime expirationTime);

}
