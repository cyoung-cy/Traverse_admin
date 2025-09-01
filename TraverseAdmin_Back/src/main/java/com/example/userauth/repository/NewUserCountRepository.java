package com.example.userauth.repository;

import com.example.userauth.model.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface NewUserCountRepository extends Repository<UserEntity, String> {

    <S extends UserEntity> S save(S entity);

    // 일별 신규 가입자 수
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.createdAt >= :start AND u.createdAt < :end")
    int countNewUsersByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 특정 시점까지의 전체 사용자 수
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE DATE(u.syncedAt) <= :date")
    int countTotalUsersUntil(@Param("date") LocalDate date);


    // 일별 활성 사용자 수 (기준: tokenUpdatedAt)
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.tokenUpdatedAt >= :start AND u.tokenUpdatedAt < :end")
    int countActiveUsersByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 연령 통계
    @Query(value =
            "SELECT " +
                    "CASE " +
                    "WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 10 AND 19 THEN '10대' " +
                    "WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 20 AND 29 THEN '20대' " +
                    "WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 30 AND 39 THEN '30대' " +
                    "WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 40 THEN '40대 이상' " +
                    "ELSE '기타' END AS ageRange, COUNT(*) AS count " +
                    "FROM users GROUP BY ageRange", nativeQuery = true)
    List<Object[]> getAgeStatsRaw();

    // 성별 통계
    @Query(value = "SELECT gender, COUNT(*) FROM users GROUP BY gender", nativeQuery = true)
    List<Object[]> getGenderStatsRaw();

    // 이메일 도메인 기반 지역 통계
    @Query(value = "SELECT SUBSTRING_INDEX(email, '@', -1) AS domain, COUNT(*) FROM users GROUP BY domain", nativeQuery = true)
    List<Object[]> getLocationStatsRaw();

    // 리텐션율 계산: 가입 다음날 tokenUpdatedAt이 찍힌 사용자 비율
    default double calculateRetentionRate(LocalDate date) {
        LocalDateTime signupStart = date.atStartOfDay();
        LocalDateTime signupEnd = signupStart.plusDays(1);

        LocalDateTime retentionStart = signupEnd;
        LocalDateTime retentionEnd = retentionStart.plusDays(1);

        int total = countByCreatedAtBetween(signupStart, signupEnd);
        if (total == 0) return 0.0;

        int retained = countRetainedUsersNextDay(signupStart, signupEnd, retentionStart, retentionEnd);
        return ((double) retained / total) * 100;
    }

    // 가입자 수 조회
    int countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 가입 다음날 활동자 수 조회 (리텐션 계산용)
    @Query("""
        SELECT COUNT(u) FROM UserEntity u
        WHERE u.createdAt BETWEEN :signupStart AND :signupEnd
        AND u.tokenUpdatedAt BETWEEN :retentionStart AND :retentionEnd
    """)
    int countRetainedUsersNextDay(
            @Param("signupStart") LocalDateTime signupStart,
            @Param("signupEnd") LocalDateTime signupEnd,
            @Param("retentionStart") LocalDateTime retentionStart,
            @Param("retentionEnd") LocalDateTime retentionEnd
    );

    // 사용자 존재 여부 확인 (중복 체크용)
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM UserEntity u")
    long countAllUsersFromFirebase();


    // 최신 동기화 기준 사용자 수 (예: syncedAt 최대값 기준)
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.syncedAt = (SELECT MAX(u2.syncedAt) FROM UserEntity u2)")
    long countLatestSyncedUsers();


    // 특정 기간 동안 활동한 사용자 수 (예: 토큰 갱신)
    long countByTokenUpdatedAtBetween(LocalDateTime start, LocalDateTime end);

}
