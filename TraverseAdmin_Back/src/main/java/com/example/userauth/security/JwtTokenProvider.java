package com.example.userauth.security;

import com.example.userauth.model.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {


    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 🔹 1시간 유효

    // 토큰에서 이메일 추출
    public String getUsernameFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject(); // 사용자 이메일 반환
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT 토큰이 만료되었습니다.", e);
        } catch (Exception e) {
            System.err.println("JWT 파싱 오류: " + e.getMessage());
            throw new RuntimeException("JWT 토큰에서 사용자 정보를 추출하는 도중 오류 발생", e);
        }
    }

    // 토큰에서 역할 확인 (관리자 역할 확인)
    public boolean hasAdminRole(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();
            String role = claims.get("role", String.class); // role이 제대로 있는지 확인
            return "chief_manager".equals(role); // 관리자의 역할을 확인
        } catch (Exception e) {
            throw new RuntimeException("JWT 토큰에서 역할을 추출하는 도중 오류 발생", e);
        }
    }


    // 🔹 JWT 토큰 생성
    public String generateToken(Admin admin) {
        Claims claims = Jwts.claims().setSubject(admin.getEmail());

        System.out.println("[JWT 생성] 이메일: " + admin.getEmail());
        System.out.println("[JWT 생성] 역할: " + admin.getRole());

        // 🔥 권한을 배열로 저장해야 이후 parsing이 일관되게 작동
        claims.put("roles", List.of(admin.getRole()));  // ex: ["chief_manager"]

        claims.put("user_id", admin.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }


    // JWT 토큰 검증 및 정보 추출
    public String getEmailFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT 토큰이 만료되었습니다.", e);
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            throw new RuntimeException("잘못된 JWT 토큰 형식입니다.", e);
        } catch (Exception e) {
            throw new RuntimeException("JWT 토큰에서 사용자 정보를 추출하는 도중 오류 발생", e);
        }
    }

    // 🔹 JWT 만료 여부 확인
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            return false;
        }catch (Exception e) {
            return false; // 그 외의 예외 처리
        }
    }

    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        List<String> roles = (List<String>) claims.get("roles");  // 이제 정상 작동
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }


    public Authentication getAuthentication(Admin admin) { // 🔹 UserDetails 없이 Authentication 반환
        Collection<? extends GrantedAuthority> authorities = admin.getAuthorities();
        return new UsernamePasswordAuthenticationToken(admin, null, authorities);
    }
}



