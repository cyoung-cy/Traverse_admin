package com.example.userauth.repository;

import com.example.userauth.model.ReportEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface NewReportCountRepository extends Repository<ReportEntity, String> {

    @Query("SELECT COUNT(r) FROM ReportEntity r WHERE DATE(r.createdAt) = :date")
    int countNewReportsByDate(LocalDate date);

    @Query("SELECT COUNT(r) FROM ReportEntity r WHERE DATE(r.syncedAt) <= :date")
    int countTotalReportsUntil(@Param("date") LocalDate date);


    // 최신 동기화 기준 신고 수
    @Query("SELECT COUNT(r) FROM ReportEntity r WHERE r.syncedAt = (SELECT MAX(r2.syncedAt) FROM ReportEntity r2)")
    long countLatestSyncedReports();

    // Firebase 기준 전체 신고 수
    @Query("SELECT COUNT(r) FROM ReportEntity r")
    long countAllReportsFromFirebase();

    // 상태별 신고 수 (pending, resolved 등)
    long countByStatus(String status);

    // 신고 사유별 그룹별 카운트
    @Query("SELECT r.reason, COUNT(r) FROM ReportEntity r GROUP BY r.reason")
    List<Object[]> countByReasonGrouped();

    // NewReportCountRepository.java
    @Query("SELECT r FROM ReportEntity r WHERE r.syncedAt >= :start AND r.syncedAt < :end")
    List<ReportEntity> findBySyncedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    <S extends ReportEntity> S save(S entity); // 반드시 추가해야 저장 가능

}
