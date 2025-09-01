package com.example.userauth.service;

import com.example.userauth.dto.response.NotificationHistoryItemDTO;
import com.example.userauth.dto.response.NotificationHistoryResponseDTO;
import com.example.userauth.model.Notification;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class NotificationHistoryService {

    private final Firestore firestore;

    public NotificationHistoryService(Firestore firestore) {
        this.firestore = firestore;
    }

    public NotificationHistoryResponseDTO getNotificationHistory(int page, int size) throws ExecutionException, InterruptedException {
        CollectionReference notificationsRef = firestore.collection("notifications");

        // sent_at 기준 내림차순 정렬, size 만큼만 조회 (페이징은 간단히 offset 개념 없이 size만 사용)
        Query query = notificationsRef.orderBy("sent_at", Query.Direction.DESCENDING).limit(size);

        QuerySnapshot querySnapshot = query.get().get();

        List<NotificationHistoryItemDTO> historyList = new ArrayList<>();

        // 날짜 포맷 설정
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        querySnapshot.getDocuments().forEach(doc -> {
            Notification notif = doc.toObject(Notification.class);

            NotificationHistoryItemDTO dto = new NotificationHistoryItemDTO();
            dto.setId(doc.getId());
            dto.setTemplateId(null);
            dto.setTemplateName(null);
            dto.setType(notif.getType());

            Timestamp sentAtTimestamp = notif.getSent_at();
            String sentAtStr = (sentAtTimestamp != null) ? formatter.format(sentAtTimestamp.toDate()) : null;
            dto.setSentAt(sentAtStr);

            dto.setRecipientCount(notif.getRecipient_count());
            dto.setReadCount(notif.getRead_count());
            dto.setSentBy(notif.getSent_by());

            historyList.add(dto);
        });

        NotificationHistoryResponseDTO response = new NotificationHistoryResponseDTO();
        response.setSuccess(true);

        NotificationHistoryResponseDTO.HistoryData data = new NotificationHistoryResponseDTO.HistoryData();
        data.setNotifications(historyList);
        data.setTotalCount(historyList.size());  // Firestore 전체 count는 별도 쿼리 필요, 일단 조회된 개수로 세팅
        data.setCurrentPage(page);
        data.setTotalPages(1); // Firestore에 전체 페이지 정보 없음, 필요하면 별도 계산 필요

        response.setData(data);
        return response;
    }
}
