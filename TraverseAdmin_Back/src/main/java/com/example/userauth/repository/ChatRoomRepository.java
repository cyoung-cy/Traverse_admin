package com.example.userauth.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Repository
public class ChatRoomRepository {

    private static final String COLLECTION_CHAT_ROOMS = "chatRooms";

    private final Firestore db;

    public ChatRoomRepository() {
        this.db = FirestoreClient.getFirestore();
    }

    // 채팅방 전체 조회 (필터 및 검색 없이)
    public List<QueryDocumentSnapshot> findAll() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_CHAT_ROOMS).get();
        return future.get().getDocuments();
    }

    // 특정 상태(status)로 채팅방 조회
    public List<QueryDocumentSnapshot> findByStatus(String status) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_CHAT_ROOMS)
                .whereEqualTo("status", status)
                .get();
        return future.get().getDocuments();
    }

    // 채팅방 이름으로 검색
    public List<QueryDocumentSnapshot> findByNameStartingWith(String namePrefix) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_CHAT_ROOMS)
                .orderBy("name")
                .startAt(namePrefix)
                .endAt(namePrefix + "\uf8ff")
                .get();
        return future.get().getDocuments();
    }

    // 채팅방 ID로 단일 조회
    public DocumentSnapshot findById(String roomId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(COLLECTION_CHAT_ROOMS).document(roomId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        return future.get();
    }

    // 새 채팅방 저장
    public void save(String roomId, Map<String, Object> chatRoomData) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = db.collection(COLLECTION_CHAT_ROOMS).document(roomId).set(chatRoomData);
        future.get();
    }

    // 채팅방 상태 변경 등 업데이트
    public void update(String roomId, Map<String, Object> updates) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(COLLECTION_CHAT_ROOMS).document(roomId);
        ApiFuture<WriteResult> future = docRef.update(updates);
        future.get();
    }

    // 채팅방 삭제
    public void delete(String roomId) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = db.collection(COLLECTION_CHAT_ROOMS).document(roomId).delete();
        future.get();
    }
}
