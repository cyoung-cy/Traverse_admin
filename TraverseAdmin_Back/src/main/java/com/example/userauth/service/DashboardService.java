package com.example.userauth.service;

import com.example.userauth.dto.response.MainDashboardResponseDTO;
import com.example.userauth.model.*;
import com.example.userauth.repository.*;
import com.example.userauth.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final NewUserCountRepository userRepository;
    private final NewPostCountRepository postRepository;
    private final NewSnapPostCountRepository snapPostRepository;
    private final NewReportCountRepository reportRepository;

    public MainDashboardResponseDTO getMainDashboardData(String period) {
        LocalDateTime[] range = DateUtil.getDateRange(period);
        LocalDateTime start = range[0];
        LocalDateTime end = range[1];

        // 오늘 날짜 기준 시간 범위
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);

        // ✅ 사용자 통계
        long totalUsersFirebase = userRepository.countAllUsersFromFirebase(); // 전체 Firebase 유저 수
        long activeUsers = userRepository.countByTokenUpdatedAtBetween(start, end);
        long newUsers = userRepository.countByCreatedAtBetween(startOfToday, endOfToday); // 오늘 새 유저
        double growth = totalUsersFirebase == 0 ? 0 : (double) newUsers / totalUsersFirebase * 100;

        // ✅ 콘텐츠 통계 (포스트)
        long totalPostsFirebase = postRepository.countAllPostsFromFirebase(); // 전체 Firebase 포스트 수
        long newPosts = postRepository.countByCreatedAtBetween(startOfToday, endOfToday); // 오늘 새 포스트
        long pendingReview = postRepository.countByReportCountGreaterThan(0);

        // ✅ 신고 통계
        long pendingReports = 0; // Firestore 기준
        long resolvedReports = 0; // Firestore 기준
        long totalReportsFirebase = 0; // Firestore 기준
        List<Object[]> categoryCounts = reportRepository.countByReasonGrouped(); // MySQL 기준
        var byCategory = categoryCounts.stream().map(obj -> {
            MainDashboardResponseDTO.CategoryCount c = new MainDashboardResponseDTO.CategoryCount();
            c.setCategory((String) obj[0]);
            c.setCount((Long) obj[1]);
            return c;
        }).collect(Collectors.toList());

        // ✅ 실시간 Firestore 데이터
        Firestore db = FirestoreClient.getFirestore();
        long totalUsersRealtime = 0;
        long todayReportsCount = 0;
        long activeChatRoomsCount = 0;
        long commentCount = 0; // Firebase 댓글 수

        try {
            // 총 회원 수
            totalUsersRealtime = db.collection("users").get().get().size();

            // 오늘 생성된 신고 수
            Timestamp startTimestamp = Timestamp.ofTimeSecondsAndNanos(
                    startOfToday.toEpochSecond(java.time.ZoneOffset.UTC), 0);
            Timestamp endTimestamp = Timestamp.ofTimeSecondsAndNanos(
                    endOfToday.toEpochSecond(java.time.ZoneOffset.UTC), 0);

            todayReportsCount = db.collection("reports")
                    .whereGreaterThanOrEqualTo("created_at", startTimestamp)
                    .whereLessThan("created_at", endTimestamp)
                    .get().get().size();

            // 전체 신고 수 (Firebase 기준)
            totalReportsFirebase = db.collection("reports").get().get().size();

            // 미처리 신고 수 (Firebase 기준)
            pendingReports = db.collection("reports")
                    .whereEqualTo("status", "pending")
                    .get().get().size();

            // 처리 완료 신고 수 (Firebase 기준)
            resolvedReports = db.collection("reports")
                    .whereEqualTo("status", "resolved")
                    .get().get().size();

            // 활성 채팅방 수
            activeChatRoomsCount = db.collection("chatRooms").get().get().size();

            // 댓글 수: Post_Comments + Snap_Comments
            long postComments = db.collection("Post_Comments").get().get().size();
            long snapComments = db.collection("Snap_Comments").get().get().size();
            commentCount = postComments + snapComments;

        } catch (Exception e) {
            e.printStackTrace(); // 예외는 로그만 출력
        }

        // ✅ 응답 구성
        var dto = new MainDashboardResponseDTO();
        dto.setSuccess(true);
        var data = new MainDashboardResponseDTO.Data();

        var userStats = new MainDashboardResponseDTO.UserStats();
        userStats.setTotal(totalUsersFirebase);
        userStats.setNewUsers(newUsers);
        userStats.setActive(activeUsers);
        userStats.setGrowth(growth);

        var contentStats = new MainDashboardResponseDTO.ContentStats();
        contentStats.setTotal_posts(totalPostsFirebase);
        contentStats.setNew_posts(newPosts);
        contentStats.setPending_review(pendingReview);
        contentStats.setComment_count(commentCount); // Firebase 댓글 수

        var reportStats = new MainDashboardResponseDTO.ReportStats();
        reportStats.setTotal(totalReportsFirebase); // 전체 신고 수 (Firebase)
        reportStats.setPending(pendingReports);     // 미처리 신고 수 (Firebase)
        reportStats.setResolved(resolvedReports);   // 처리 완료 수 (Firebase)
        reportStats.setBy_category(byCategory);     // 카테고리별 (MySQL)

        data.setUser_stats(userStats);
        data.setContent_stats(contentStats);
        data.setReport_stats(reportStats);
        data.setRecent_activity(new ArrayList<>());

        // ✅ 실시간 필드
        data.setTotal_users(totalUsersRealtime);
        data.setRecent_reports(todayReportsCount);
        data.setActive_chat_rooms(activeChatRoomsCount);

        dto.setData(data);
        return dto;
    }
}
