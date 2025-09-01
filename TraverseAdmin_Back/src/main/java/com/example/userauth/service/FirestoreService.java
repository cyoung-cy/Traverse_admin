package com.example.userauth.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {
    // 특정 컬렉션에서 문서를 가져옴
    public Map<String, Object> getDocument(String collection, String documentId) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference docRef = db.collection(collection).document(documentId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                return document.getData();
            } else {
                System.out.println("문서를 찾을 수 없습니다: " + collection + "/" + documentId);
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("문서 가져오기 오류: " + e.getMessage());
            return null;
        }
    }

    // 특정 컬렉션에서 문서를 가져와 특정 필드값을 반환
    public Object getFieldFromDocument(String collection, String documentId, String fieldName) {
        Map<String, Object> docData = getDocument(collection, documentId);
        if (docData != null && docData.containsKey(fieldName)) {
            return docData.get(fieldName);
        }
        return null;
    }


}