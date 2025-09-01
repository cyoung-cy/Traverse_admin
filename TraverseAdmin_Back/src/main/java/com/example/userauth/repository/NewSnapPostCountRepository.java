package com.example.userauth.repository;

import com.example.userauth.model.SnapPostEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface NewSnapPostCountRepository extends Repository<SnapPostEntity, String> {

    @Query("SELECT COUNT(s) FROM SnapPostEntity s WHERE DATE(s.createdAt) = :date")
    int countNewSnapPostsByDate(LocalDate date);

    @Query("SELECT COUNT(s) FROM SnapPostEntity s WHERE s.createdAt BETWEEN :start AND :end")
    int countSnapPostsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(s.commentCount) FROM SnapPostEntity s WHERE s.createdAt BETWEEN :start AND :end")
    Integer countCommentsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(s.likeCount) FROM SnapPostEntity s WHERE s.createdAt BETWEEN :start AND :end")
    Integer countLikesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT s FROM SnapPostEntity s WHERE s.createdAt BETWEEN :start AND :end ORDER BY (s.likeCount + s.commentCount) DESC")
    List<SnapPostEntity> findTopSnapsByEngagement(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    <S extends SnapPostEntity> S save(S entity);

    @Query("SELECT COUNT(s) FROM SnapPostEntity s")
    long countAllSnapPostsFromFirebase();

    @Query("SELECT COALESCE(SUM(s.commentCount), 0) FROM SnapPostEntity s")
    long sumCommentCount();
    @Query("SELECT COUNT(u) FROM SnapPostEntity u WHERE u.syncedAt <= :time")
    int countTotalUsersUntil(@Param("time") LocalDateTime time);

    // 특정 일자의 Firebase created_at 기준 수
    @Query("SELECT COUNT(u) FROM SnapPostEntity u WHERE u.createdAt BETWEEN :start AND :end")
    long countCreatedUsersOnDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(s) FROM SnapPostEntity s WHERE DATE(s.syncedAt) <= :date")
    int countTotalSnapPostsUntil(@Param("date") LocalDate date);

}
