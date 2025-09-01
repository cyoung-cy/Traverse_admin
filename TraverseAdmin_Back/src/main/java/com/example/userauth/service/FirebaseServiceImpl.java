package com.example.userauth.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseServiceImpl implements FirebaseService {

    private final Firestore firestore;

    public FirebaseServiceImpl() {
        this.firestore = FirestoreClient.getFirestore();
    }

    @Override
    public int countUsersCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return countDocumentsBetween("users", "created_at", start, end);
    }

    @Override
    public int countPostsCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return countDocumentsBetween("posts", "created_at", start, end);
    }

    @Override
    public int countSnapPostsCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return countDocumentsBetween("snapPosts", "created_at", start, end);
    }

    @Override
    public int countReportsCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return countDocumentsBetween("reports", "created_at", start, end);
    }

    private int countDocumentsBetween(String collection, String field, LocalDateTime start, LocalDateTime end) {
        // UTC 기준으로 LocalDateTime을 Timestamp로 변환
        Timestamp startTs = Timestamp.ofTimeSecondsAndNanos(
                start.toInstant(ZoneOffset.UTC).getEpochSecond(),
                start.toInstant(ZoneOffset.UTC).getNano()
        );
        Timestamp endTs = Timestamp.ofTimeSecondsAndNanos(
                end.toInstant(ZoneOffset.UTC).getEpochSecond(),
                end.toInstant(ZoneOffset.UTC).getNano()
        );

        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(collection)
                    .whereGreaterThanOrEqualTo(field, startTs)
                    .whereLessThan(field, endTs)
                    .get();
            return future.get().size();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return 0;
        }
    }

}
