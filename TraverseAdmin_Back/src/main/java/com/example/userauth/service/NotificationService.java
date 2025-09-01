package com.example.userauth.service;

import com.example.userauth.dto.request.NotificationRequestDTO;
import com.example.userauth.dto.response.NotificationResponseDTO;
import com.example.userauth.model.Notification;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final Firestore firestore;

    public NotificationService(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * 알림 발송 서비스
     */
    public NotificationResponseDTO sendNotification(NotificationRequestDTO requestDTO) throws ExecutionException, InterruptedException {
        List<String> recipients = requestDTO.getRecipients();

        // 전체 사용자 발송 여부 확인
        boolean sendToAll = recipients != null && recipients.size() == 1 && "all".equalsIgnoreCase(recipients.get(0));

        // 전체 사용자 ID 조회
        List<String> targetUserIds = firestore.collection("users").get().get()
                .getDocuments()
                .stream()
                .map(doc -> doc.getId())
                .collect(Collectors.toList());


        // users 필드 생성 (user_id + read = false)
        List<Map<String, Object>> userList = new ArrayList<>();
        for (String userId : targetUserIds) {
            Map<String, Object> userEntry = new HashMap<>();
            userEntry.put("user_id", userId);
            userEntry.put("read", false);
            userList.add(userEntry);
        }

        // 알림 정보 생성
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Timestamp sentAt = Timestamp.ofTimeSecondsAndNanos(now.toEpochSecond(ZoneOffset.UTC), now.getNano());

        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("title", requestDTO.getTitle() != null ? requestDTO.getTitle() : "알림");
        notificationData.put("content", requestDTO.getContent() != null ? requestDTO.getContent() : "");
        notificationData.put("action_url", requestDTO.getAction_url() != null ? requestDTO.getAction_url() : "");
        notificationData.put("image_url", requestDTO.getImage_url() != null ? requestDTO.getImage_url() : "");
        notificationData.put("is_announcement", true);
        notificationData.put("notification_category",
                requestDTO.getNotification_category() != null ? requestDTO.getNotification_category().toLowerCase() : "system");
        notificationData.put("read_count", 0);
        notificationData.put("recipient_count", userList.size());
        notificationData.put("reference_id", "");
        notificationData.put("sent_at", sentAt);
        notificationData.put("sent_by", "admin");
        notificationData.put("type", requestDTO.getType() != null ? requestDTO.getType() : "announcement");
        notificationData.put("users", userList);  // 전체 사용자 포함

        // Firestore 저장
        DocumentReference docRef = firestore.collection("notifications").document();
        docRef.set(notificationData).get();

        return new NotificationResponseDTO(true, targetUserIds);
    }

    public Map<String, Object> getNotificationHistory(int page, int limit, String startDate, String endDate) throws ExecutionException, InterruptedException {
        // 날짜 파싱
        Timestamp startTimestamp = null;
        Timestamp endTimestamp = null;

        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");

            startTimestamp = Timestamp.ofTimeSecondsAndNanos(start.toEpochSecond(ZoneOffset.UTC), 0);
            endTimestamp = Timestamp.ofTimeSecondsAndNanos(end.toEpochSecond(ZoneOffset.UTC), 999_999_999);
        }

        // 쿼리 구성
        var query = firestore.collection("notifications").orderBy("sent_at", com.google.cloud.firestore.Query.Direction.DESCENDING);

        if (startTimestamp != null && endTimestamp != null) {
            query = query
                    .whereGreaterThanOrEqualTo("sent_at", startTimestamp)
                    .whereLessThanOrEqualTo("sent_at", endTimestamp);
        }

        var snapshot = query.get().get();
        var documents = snapshot.getDocuments();

        int total = documents.size();
        int fromIndex = (page - 1) * limit;
        int toIndex = Math.min(fromIndex + limit, total);

        List<Map<String, Object>> notifications = new ArrayList<>();
        for (var doc : documents.subList(fromIndex, toIndex)) {
            Map<String, Object> data = doc.getData();

            Timestamp sentAt = (Timestamp) data.get("sent_at");
            data.put("sent_at", sentAt.toDate().toInstant().toString());
            data.put("id", doc.getId());

            notifications.add(data);
        }

        return Map.of(
                "success", true,
                "data", Map.of(
                        "total", total,
                        "page", page,
                        "limit", limit,
                        "notifications", notifications
                )
        );
    }

}
