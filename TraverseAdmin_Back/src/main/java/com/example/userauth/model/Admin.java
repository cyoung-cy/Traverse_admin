package com.example.userauth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "admin")  // 테이블명 지정
public class Admin implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
    private boolean emailCertification = true; // 기본값 false 설정
    private String passwordConfirm; // 기본값 빈 문자열 설정
    private String invitecode;  // inviteCode를 authCode로 변경
    private String role;
    private String status;
    private Timestamp last_login_at;
    // Getters and Setters

    @Column(nullable = false, updatable = false)
    private Timestamp created_at = new Timestamp(System.currentTimeMillis());

    @Column(nullable = false)
    private Timestamp updated_at = new Timestamp(System.currentTimeMillis());

    @PreUpdate
    protected void onUpdate() {
        this.updated_at = new Timestamp(System.currentTimeMillis());
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEmailCertification() {
        return emailCertification;
    }

    public void setEmailCertification(boolean emailCertification) {
        this.emailCertification = emailCertification;
    }

    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }

    public String getInvitecode() {
        return invitecode;
    }

    public void setInvitecode(String invitecode) {
        this.invitecode = invitecode;
    }


    public Timestamp getLast_login_at() {
        return last_login_at;
    }

    public void setLast_login_at(Timestamp last_login_at) {
        this.last_login_at = last_login_at;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (role != null && !role.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return authorities;
    }


    @Override
    public String getUsername() {
        return this.email; // username은 보통 이메일을 사용합니다.
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return emailCertification; // 이메일 인증 여부에 따라 활성화 여부 결정
    }

    // Getters and Setters for other fields



}
