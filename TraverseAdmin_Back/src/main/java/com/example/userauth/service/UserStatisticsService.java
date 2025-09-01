package com.example.userauth.service;

import com.example.userauth.model.Admin;
import com.example.userauth.model.ReportEntity;
import com.example.userauth.repository.NewReportCountRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class UserStatisticsService {

    private static final Firestore db = FirestoreClient.getFirestore();
    private final NewReportCountRepository newReportCountRepository;

    public UserStatisticsService(NewReportCountRepository newReportCountRepository) {
        this.newReportCountRepository = newReportCountRepository;
    }

    // 사용자 통계 대시보드 데이터를 가져옴
    public Map<String, Object> getUserStatistics(String startDate, String endDate, String interval) {
        Map<String, Object> response = new HashMap<>();
        try {
            // SecurityContextHolder에서 인증된 사용자 정보를 가져옵니다.
            String email = getAuthenticatedUserEmail();
            if (email == null) {
                response.put("success", false);
                response.put("error", "사용자가 인증되지 않았습니다.");
                return response;
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date start = sdf.parse(startDate);
            Date end = sdf.parse(endDate);

            Timestamp startTimestamp = Timestamp.of(start);
            // ✅ 하루를 더한 endTimestamp (다음날 00:00 기준)
            Calendar cal = Calendar.getInstance();
            cal.setTime(end);
            cal.add(Calendar.DAY_OF_MONTH, 1);
            Timestamp endTimestamp = Timestamp.of(cal.getTime());

            // 사용자 통계
            int totalUsers = getTotalUserCount();
            int newUsers = getNewUserCountToday(); // 수정된 부분
            // activeUsers 계산: status가 없거나 "active"인 사용자만 카운트
            int activeUsers = 0;
            try {
                CollectionReference usersRef = db.collection("users");
                ApiFuture<QuerySnapshot> future = usersRef
                        .whereGreaterThanOrEqualTo("created_at", startTimestamp)
                        .whereLessThan("created_at", endTimestamp)
                        .get();

                List<QueryDocumentSnapshot> documents = future.get().getDocuments();

                long activeCount = documents.stream()
                        .filter(doc -> {
                            Object status = doc.get("status");
                            return status == null || "active".equals(status.toString());
                        })
                        .count();

                activeUsers = (int) activeCount;
            } catch (Exception e) {
                e.printStackTrace();
            }

            // 사용자 트렌드
            List<Map<String, Object>> userTrend = getUserTrend(startTimestamp, endTimestamp, interval);

            // 리포트 통계
            Map<String, Object> reportStats = getReportStatistics(startTimestamp, endTimestamp);

            response.put("success", true);
            response.put("total_users", totalUsers);
            response.put("new_users", newUsers);
            response.put("active_users", activeUsers);
            response.put("user_trend", userTrend);
            response.put("report_stats", reportStats);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "사용자 통계 조회 중 오류가 발생했습니다.");
            e.printStackTrace();
        }

        return response;
    }

    // 현재 인증된 사용자 이메일을 가져오는 메서드
    private String getAuthenticatedUserEmail() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (principal instanceof Admin) {
                return ((Admin) principal).getEmail();
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    // 전체 사용자 수를 가져옴
    private int getTotalUserCount() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection("users").get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }

    // 새로운 사용자 수를 가져옴
    private int getNewUserCount(Timestamp start, Timestamp end) throws ExecutionException, InterruptedException {
        Query query = db.collection("users")
                .whereGreaterThanOrEqualTo("created_at", start)
                .whereLessThanOrEqualTo("created_at", end);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }

    // 활성 사용자 수를 가져옴
    private int getActiveUserCount(Timestamp start, Timestamp end) throws ExecutionException, InterruptedException {
        CollectionReference usersRef = db.collection("users");

        // last_login_at 기준으로 필터링 (start <= last_login_at < end)
        ApiFuture<QuerySnapshot> future = usersRef
                .whereGreaterThanOrEqualTo("last_login_at", start)
                .whereLessThan("last_login_at", end)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        // status가 null이거나 "active"인 사용자 필터링
        long activeCount = documents.stream()
                .filter(doc -> {
                    Object status = doc.get("status");
                    return status == null || "active".equals(status.toString());
                })
                .count();

        return (int) activeCount;
    }


    // 사용자 트렌드를 일별, 주간, 월간으로 가져옴
    private List<Map<String, Object>> getUserTrend(Timestamp start, Timestamp end, String interval) throws ExecutionException, InterruptedException {
        List<Map<String, Object>> trend = new ArrayList<>();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(start.toDate());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        while (calendar.getTime().before(end.toDate())) {
            Date currentDate = calendar.getTime();
            String formattedDate = sdf.format(currentDate);

            // 현재 날짜를 기준으로 00:00:00 ~ 23:59:59 Timestamp 생성
            Calendar dayStart = Calendar.getInstance();
            dayStart.setTime(currentDate);
            dayStart.set(Calendar.HOUR_OF_DAY, 0);
            dayStart.set(Calendar.MINUTE, 0);
            dayStart.set(Calendar.SECOND, 0);
            dayStart.set(Calendar.MILLISECOND, 0);

            Timestamp dayStartTs = Timestamp.of(dayStart.getTime());
            Calendar dayEnd = (Calendar) dayStart.clone();
            dayEnd.add(Calendar.DAY_OF_MONTH, 1);

            Timestamp dayEndTs = Timestamp.of(dayEnd.getTime());

            // 모든 사용자 가져오기 (created_at 필드 존재하는)
            ApiFuture<QuerySnapshot> usersFuture = db.collection("users")
                    .whereLessThan("created_at", dayEndTs)  // created_at <= date
                    .get();

            List<QueryDocumentSnapshot> users = usersFuture.get().getDocuments();

            int totalCount = users.size();

            // active users: status가 없거나 == "active"
            int activeCount = (int) users.stream()
                    .filter(doc -> {
                        Object status = doc.get("status");
                        return status == null || "active".equals(status);
                    })
                    .count();

            // new users: created_at >= dayStart && < dayEnd
            int newUserCount = (int) users.stream()
                    .filter(doc -> {
                        Timestamp createdAt = doc.getTimestamp("created_at");
                        return createdAt != null &&
                                !createdAt.toDate().before(dayStart.getTime()) &&
                                createdAt.toDate().before(dayEnd.getTime());
                    })
                    .count();

            Map<String, Object> trendData = new HashMap<>();
            trendData.put("date", formattedDate);
            trendData.put("count", totalCount);
            trendData.put("new_users", newUserCount);
            trendData.put("active_users", activeCount);

            trend.add(trendData);

            // 다음 날짜로 이동
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        return trend;
    }

    private int getNewUserCountToday() throws ExecutionException, InterruptedException {
        CollectionReference usersRef = db.collection("users");

        // 오늘 자정 기준 시작/끝 시간 설정
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfDay = calendar.getTime();

        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date endOfDay = calendar.getTime();

        Timestamp start = Timestamp.of(startOfDay);
        Timestamp end = Timestamp.of(endOfDay);

        ApiFuture<QuerySnapshot> future = usersRef
                .whereGreaterThanOrEqualTo("created_at", start)
                .whereLessThan("created_at", end)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        return documents.size();
    }

    // 특정 날짜의 사용자 수를 가져옴
    private int getUserCountByDate(Date date) throws ExecutionException, InterruptedException {
        // 특정 날짜에 가입한 사용자 수를 계산하는 로직
        Timestamp timestamp = Timestamp.of(date);
        Query query = db.collection("users")
                .whereGreaterThanOrEqualTo("created_at", timestamp)
                .whereLessThanOrEqualTo("created_at", timestamp);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }

    // 특정 날짜의 새로운 사용자 수를 가져옴
    private int getNewUserCountByDate(Date date) throws ExecutionException, InterruptedException {
        // 특정 날짜에 새로 가입한 사용자 수를 계산하는 로직
        Timestamp timestamp = Timestamp.of(date);
        Query query = db.collection("users")
                .whereGreaterThanOrEqualTo("created_at", timestamp)
                .whereLessThanOrEqualTo("created_at", timestamp);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }

    // 특정 날짜의 활성 사용자 수
    private int getActiveUserCountByDate(Date date) throws ExecutionException, InterruptedException {
        // 특정 날짜에 로그인한 사용자 수를 계산하는 로직
        Timestamp timestamp = Timestamp.of(date);
        Query query = db.collection("users")
                .whereGreaterThanOrEqualTo("last_login_at", timestamp)
                .whereLessThanOrEqualTo("last_login_at", timestamp);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }

    // 리포트 통계
    private Map<String, Object> getReportStatistics(Timestamp startTimestamp, Timestamp endTimestamp) throws ExecutionException, InterruptedException {
        Map<String, Object> reportStats = new HashMap<>();

        // ✅ 1. Firebase에서 start~end 구간의 신고 데이터 조회
        Query query = db.collection("reports")
                .whereGreaterThanOrEqualTo("created_at", startTimestamp)
                .whereLessThan("created_at", endTimestamp);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        int total = documents.size();
        int pending = 0;
        int resolved = 0;
        Map<String, Integer> categoryCountMap = new HashMap<>();

        for (DocumentSnapshot doc : documents) {
            String status = doc.getString("status");
            if ("pending".equalsIgnoreCase(status)) {
                pending++;
            } else if ("resolved".equalsIgnoreCase(status)) {
                resolved++;
            }

            String reason = doc.getString("reason");
            if (reason != null) {
                categoryCountMap.put(reason, categoryCountMap.getOrDefault(reason, 0) + 1);
            }
        }

        // ✅ 결과 구성
        reportStats.put("total", total);
        reportStats.put("pending", pending);
        reportStats.put("resolved", resolved);

        List<Map<String, Object>> byCategory = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : categoryCountMap.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", entry.getKey());
            categoryData.put("count", entry.getValue());
            byCategory.add(categoryData);
        }

        reportStats.put("by_category", byCategory);

        return reportStats;
    }
}
