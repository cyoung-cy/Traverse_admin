package com.example.userauth.repository;

import com.example.userauth.model.PostEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface NewPostCountRepository extends Repository<PostEntity, Long> {

    @Query("SELECT COUNT(p) FROM PostEntity p WHERE DATE(p.createdAt) = :date")
    int countNewPostsByDate(LocalDate date);
    @Query("SELECT COUNT(p) FROM PostEntity p WHERE DATE(p.syncedAt) <= :date")
    int countTotalPostsUntil(@Param("date") LocalDate date);

    // 저장을 위한 메서드 명시
    <S extends PostEntity> S save(S entity);

    @Query("SELECT COUNT(p) FROM PostEntity p WHERE p.createdAt BETWEEN :start AND :end")
    int countPostsBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.commentCount), 0) FROM PostEntity p WHERE p.createdAt BETWEEN :start AND :end")
    int countCommentsBetween(LocalDateTime start, LocalDateTime end);


    @Query("SELECT COALESCE(SUM(p.likeCount), 0) FROM PostEntity p WHERE p.createdAt BETWEEN :start AND :end")
    int countLikesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM PostEntity p WHERE p.createdAt BETWEEN :start AND :end ORDER BY (p.likeCount + p.commentCount) DESC")
    List<PostEntity> findTopPostsByEngagement(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(p) FROM PostEntity p")
    long countAllPostsFromFirebase();

    // 최신 동기화 기준 포스트 수
    @Query("SELECT COUNT(p) FROM PostEntity p WHERE p.syncedAt = (SELECT MAX(p2.syncedAt) FROM PostEntity p2)")
    long countLatestSyncedPosts();

    // 신고 1건 이상인 포스트 수
    long countByReportCountGreaterThan(int count);

    // 전체 포스트 댓글 수 합계
    @Query("SELECT COALESCE(SUM(p.commentCount), 0) FROM PostEntity p")
    long sumCommentCount();
    // 특정 일자의 Firebase created_at 기준 수
    @Query("SELECT COUNT(u) FROM PostEntity u WHERE u.createdAt BETWEEN :start AND :end")
    long countCreatedUsersOnDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    long countByCreatedAtBetween(LocalDateTime startOfToday, LocalDateTime endOfToday);
}
