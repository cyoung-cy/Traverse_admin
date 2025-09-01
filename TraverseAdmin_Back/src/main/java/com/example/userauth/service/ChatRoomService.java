package com.example.userauth.service;

import com.example.userauth.dto.response.*;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    private static final String COLLECTION_CHAT_ROOMS = "chatRooms";

    public ChatRoomListResponseDTO getChatRooms(int page, int limit, String status, String search) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference chatRoomsRef = db.collection(COLLECTION_CHAT_ROOMS);

        Query query = chatRoomsRef;

        if (!"all".equalsIgnoreCase(status)) {
            if ("active".equalsIgnoreCase(status)) {
                query = query.whereEqualTo("is_deleted", false);
            } else if ("archived".equalsIgnoreCase(status)) {
                query = query.whereEqualTo("is_deleted", true);
            }
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<ChatRoomDTO> roomList = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            String roomId = doc.getId();
            Map<String, Object> data = doc.getData();

            ChatRoomDTO roomDTO = new ChatRoomDTO();
            roomDTO.setRoomId(roomId);
            roomDTO.setName((String) data.getOrDefault("name", ""));
            roomDTO.setType((String) data.getOrDefault("type", "direct"));
            roomDTO.setCreatedAt(formatTimestampToISO((Timestamp) data.get("created_at")));
            roomDTO.setLastMessageAt(formatTimestampToISO((Timestamp) data.get("last_message_time")));

            // ✅ messages 서브컬렉션에서 메시지 수 직접 계산
            CollectionReference messagesRef = doc.getReference().collection("messages");
            int messageCount = messagesRef.get().get().size();
            roomDTO.setMessageCount(messageCount);

            roomDTO.setReportCount(getLong(data.get("report_count")));

            Boolean isDeleted = (Boolean) data.getOrDefault("is_deleted", false);
            roomDTO.setStatus(isDeleted != null && isDeleted ? "archived" : "active");

            List<String> participants = (List<String>) data.getOrDefault("participants", Collections.emptyList());
            List<ChatParticipantDTO> participantDTOs = participants.stream().map(userId -> {
                ChatParticipantDTO participant = new ChatParticipantDTO();
                participant.setUserId(userId);
                participant.setUsername("username_for_" + userId); // TODO: 실제 사용자명 조회 필요
                return participant;
            }).collect(Collectors.toList());
            roomDTO.setParticipants(participantDTOs);

            roomList.add(roomDTO);
        }

        int totalCount = roomList.size();
        int totalPages = (int) Math.ceil((double) totalCount / limit);
        int fromIndex = Math.min((page - 1) * limit, totalCount);
        int toIndex = Math.min(fromIndex + limit, totalCount);

        List<ChatRoomDTO> paginatedRooms = roomList.subList(fromIndex, toIndex);

        return new ChatRoomListResponseDTO(paginatedRooms, totalCount, page, totalPages);
    }



    private Instant toInstant(Object timestamp) {
        if (timestamp instanceof Timestamp) {
            return ((Timestamp) timestamp).toDate().toInstant();
        }
        return null;
    }

    private long getLong(Object value) {
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return 0;
    }

    // 클래스의 끝 부분에 추가해 주세요 (다른 메서드들과 같은 레벨)
    private LocalDateTime toLocalDateTime(Object timestamp) {
        if (timestamp instanceof Timestamp) {
            return ((Timestamp) timestamp).toDate().toInstant()
                    .atZone(TimeZone.getDefault().toZoneId())
                    .toLocalDateTime();
        }
        return null;
    }

    private String formatTimestampToISO(Timestamp timestamp) {
        if (timestamp == null) return null;
        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX");
        isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return isoFormat.format(timestamp.toDate());
    }


    // 상세 조회용 메서드 예시 (roomId에 따른 상세 정보 조회)
    public ChatRoomDTO getChatRoomDetail(String roomId, int messageLimit) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // 1. 채팅방 문서 조회
        DocumentReference roomDocRef = db.collection(COLLECTION_CHAT_ROOMS).document(roomId);
        DocumentSnapshot roomDoc = roomDocRef.get().get();

        if (!roomDoc.exists()) {
            return null; // 방 없음
        }

        Map<String, Object> data = roomDoc.getData();

        ChatRoomDTO roomDTO = new ChatRoomDTO();
        roomDTO.setRoomId(roomId);
        roomDTO.setName((String) data.get("name"));
        roomDTO.setType((String) data.get("type"));
        roomDTO.setCreatedAt(formatTimestampToISO((Timestamp) data.get("created_at")));
        roomDTO.setLastMessageAt(formatTimestampToISO((Timestamp)data.get("last_message_time")));
        roomDTO.setMessageCount(getLong(data.get("message_count")));
        roomDTO.setReportCount(getLong(data.get("report_count")));
        Boolean isDeletedDetail = (Boolean) data.getOrDefault("is_deleted", false);
        roomDTO.setStatus(isDeletedDetail != null && isDeletedDetail ? "deleted" : "active");

        // 참가자 리스트 세팅 (실제 users 컬렉션에서 사용자 정보 조회)
        List<String> participants = (List<String>) data.get("participants");
        if (participants == null) participants = Collections.emptyList();

        List<ChatParticipantDTO> participantDTOs = new ArrayList<>();
        for (String userId : participants) {
            DocumentSnapshot userDoc = db.collection("users").document(userId).get().get();

            ChatParticipantDTO participant = new ChatParticipantDTO();
            participant.setUserId(userId);

            if (userDoc.exists()) {
                Map<String, Object> userData = userDoc.getData();
                // user_id 필드 또는 username 필드가 있으면 세팅
                String actualUserId = userData.get("user_id") != null ? (String) userData.get("user_id") : userId;
                // username 세팅 - user_name 필드 우선, 없으면 username, 없으면 unknown
                String username = "unknown";
                if (userData.get("user_name") != null) {
                    username = (String) userData.get("user_name");
                } else if (userData.get("username") != null) {
                    username = (String) userData.get("username");
                }
                participant.setUserId(actualUserId);
                participant.setUsername(username);
            } else {
                // 문서 없으면 기본값
                participant.setUsername("unknown");
            }

            participantDTOs.add(participant);
        }
        roomDTO.setParticipants(participantDTOs);

        // 2. 메시지 리스트 조회 (최대 messageLimit 개)
        CollectionReference messagesCol = roomDocRef.collection("messages");

        // 메시지 개수 조회 (서브컬렉션 전체 문서 수)
        long messageCount = 0;
        try {
            messageCount = messagesCol.get().get().size();  // 동기적으로 메시지 문서 수 가져오기
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        roomDTO.setMessageCount(messageCount);

        // 메시지 리스트 조회 (최대 messageLimit 개)
        Query messagesQuery = messagesCol.orderBy("timestamp", Query.Direction.DESCENDING).limit(messageLimit);
        List<MessageDTO> messageDTOs = new ArrayList<>();

        List<QueryDocumentSnapshot> messageDocs = messagesQuery.get().get().getDocuments();
        for (QueryDocumentSnapshot msgDoc : messageDocs) {
            Map<String, Object> msgData = msgDoc.getData();

            Object senderIdObj = msgData.get("senderId");
            String senderId = null;

            if (senderIdObj instanceof String) {
                senderId = (String) senderIdObj;
            } else if (senderIdObj instanceof Map) {
                Map<?, ?> senderMap = (Map<?, ?>) senderIdObj;
                if (senderMap.get("id") instanceof String) {
                    senderId = (String) senderMap.get("id");
                } else if (senderMap.get("value") instanceof String) {
                    senderId = (String) senderMap.get("value");
                }
            }

            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setMessageId(msgDoc.getId());

            // senderId를 실제 users 컬렉션에서 조회
            if (senderId != null) {
                DocumentSnapshot userDoc = db.collection("users").document(senderId).get().get();
                if (userDoc.exists()) {
                    Map<String, Object> userData = userDoc.getData();
                    String actualUserId = userData.get("user_id") != null ? (String) userData.get("user_id") : senderId;

                    String username = "unknown";
                    if (userData.get("user_name") != null) {
                        username = (String) userData.get("user_name");
                    } else if (userData.get("username") != null) {
                        username = (String) userData.get("username");
                    }

                    messageDTO.setUserId(actualUserId);
                    messageDTO.setUsername(username);
                } else {
                    messageDTO.setUserId(senderId);
                    messageDTO.setUsername("unknown");
                }
            }


            // content 필드 처리 - 문자열 또는 Map 둘 다 처리
            Object contentObj = msgData.get("content");
            if (contentObj instanceof String) {
                // content가 문자열인 경우
                messageDTO.setContent((String) contentObj);
            } else if (contentObj instanceof Map) {
                // content가 Map 형태인 경우, 간단히 Map 내용을 문자열로 변환
                Map<?, ?> contentMap = (Map<?, ?>) contentObj;

                StringBuilder sb = new StringBuilder("{");
                for (Map.Entry<?, ?> entry : contentMap.entrySet()) {
                    sb.append(entry.getKey()).append(": ").append(entry.getValue()).append(", ");
                }
                if (sb.length() > 1) sb.setLength(sb.length() - 2); // 마지막 ", " 제거
                sb.append("}");

                messageDTO.setContent(sb.toString());
            } else {
                // null 또는 다른 타입일 경우
                messageDTO.setContent(null);
            }
            messageDTO.setType((String) msgData.getOrDefault("type", null));
            messageDTO.setTimestamp(toInstant(msgData.get("timestamp")));
            messageDTO.setReportCount(getLong(msgData.getOrDefault("report_count", 0)));
            messageDTO.setReported(Boolean.TRUE.equals(msgData.getOrDefault("is_reported", false)));
            messageDTO.setRead(Boolean.TRUE.equals(msgData.getOrDefault("isRead", false)));

            messageDTOs.add(messageDTO);
        }

        // 메시지 시간순 정렬(오름차순)
        messageDTOs.sort(Comparator.comparing(MessageDTO::getTimestamp));
        roomDTO.setMessages(messageDTOs);

        // 3. 신고 리스트 조회 (최상위 reports 컬렉션에서 roomId로 조회)
        CollectionReference reportsCol = db.collection("reports");
        Query reportQuery = reportsCol
                .whereEqualTo("report_type", "chat")
                .whereEqualTo("chat_room_id", roomId);

        List<ReportDTO> reportDTOs = new ArrayList<>();
        List<QueryDocumentSnapshot> reportDocs = reportQuery.get().get().getDocuments();

        for (QueryDocumentSnapshot rptDoc : reportDocs) {
            Map<String, Object> rptData = rptDoc.getData();
            ReportDTO reportDTO = new ReportDTO();

            reportDTO.setReport_id(rptDoc.getId());
            reportDTO.setReporter_user_id((String) rptData.get("reporter_user_id"));
            reportDTO.setReason((String) rptData.get("reason"));
            reportDTO.setStatus((String) rptData.get("status"));
            reportDTO.setCreated_at(toLocalDateTime(rptData.get("created_at")));

            // reporter_name 설정
            // reporter_name 가져오기 (users 컬렉션 전체 순회하여 user_id 매칭)
            String reporterUserId = (String) rptData.get("reporter_user_id");
            String resolvedReporterName = "unknown";
            if (reporterUserId != null) {
                ApiFuture<QuerySnapshot> reporterQuery = db.collection("users").get();
                List<QueryDocumentSnapshot> reporterDocs = reporterQuery.get().getDocuments();

                for (QueryDocumentSnapshot userDoc : reporterDocs) {
                    Map<String, Object> userData = userDoc.getData();
                    if (reporterUserId.equals(userData.get("user_id"))) {
                        resolvedReporterName = userData.get("user_name") != null
                                ? userData.get("user_name").toString()
                                : "unknown";
                        break;
                    }
                }
            }
            reportDTO.setReporter_name(resolvedReporterName);

            // chat_content, reported_user_id, reported_user_name 설정 (메시지 조회)
            String chatId = (String) rptData.get("chat_id");
            if (chatId != null) {
                DocumentSnapshot messageDoc = db.collection(COLLECTION_CHAT_ROOMS)
                        .document(roomId)
                        .collection("messages")
                        .document(chatId)
                        .get()
                        .get();

                if (messageDoc.exists()) {
                    Map<String, Object> msgData = messageDoc.getData();

                    // chat_content
                    Object contentObj = msgData.get("content");
                    if (contentObj instanceof String) {
                        reportDTO.setChat_content((String) contentObj);
                    } else if (contentObj instanceof Map) {
                        Map<?, ?> contentMap = (Map<?, ?>) contentObj;
                        StringBuilder sb = new StringBuilder("{");
                        for (Map.Entry<?, ?> entry : contentMap.entrySet()) {
                            sb.append(entry.getKey()).append(": ").append(entry.getValue()).append(", ");
                        }
                        if (sb.length() > 1) sb.setLength(sb.length() - 2);
                        sb.append("}");
                        reportDTO.setChat_content(sb.toString());
                    }

                    // reported_user_id
                    Object senderIdObj = msgData.get("senderId");
                    String senderId = null;

                    if (senderIdObj instanceof String) {
                        senderId = (String) senderIdObj;
                    } else if (senderIdObj instanceof Map) {
                        Map<?, ?> senderMap = (Map<?, ?>) senderIdObj;
                        if (senderMap.get("id") instanceof String) {
                            senderId = (String) senderMap.get("id");
                        } else if (senderMap.get("value") instanceof String) {
                            senderId = (String) senderMap.get("value");
                        }
                    }

                    if (senderId != null) {
                        reportDTO.setReported_user_id(senderId);

                        DocumentSnapshot userDoc = db.collection("users").document(senderId).get().get();
                        if (userDoc.exists()) {
                            Map<String, Object> userData = userDoc.getData();
                            String reportedUserName = userData.get("user_name") != null
                                    ? (String) userData.get("user_name") : "unknown";
                            reportDTO.setReported_user_name(reportedUserName);
                        } else {
                            reportDTO.setReported_user_name("unknown");
                        }
                    } else {
                        reportDTO.setReported_user_id(null);
                        reportDTO.setReported_user_name("unknown");
                    }

                } else {
                    reportDTO.setChat_content(null);
                    reportDTO.setReported_user_id(null);
                    reportDTO.setReported_user_name("unknown");
                }
            } else {
                reportDTO.setChat_content(null);
                reportDTO.setReported_user_id(null);
                reportDTO.setReported_user_name("unknown");
            }

            reportDTOs.add(reportDTO);
        }
        roomDTO.setReports(reportDTOs);


        return roomDTO;
    }

}