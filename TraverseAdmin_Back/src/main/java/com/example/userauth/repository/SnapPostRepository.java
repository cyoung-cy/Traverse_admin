package com.example.userauth.repository;

import com.example.userauth.model.SnapPost;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class SnapPostRepository {

    private static final String COLLECTION_NAME = "SnapPost";

    public List<SnapPost> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<SnapPost> snaps = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            SnapPost snap = doc.toObject(SnapPost.class);
            snap.setId(doc.getId());
            snaps.add(snap);
        }
        return snaps;
    }

    public SnapPost findById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot document = db.collection(COLLECTION_NAME).document(id).get().get();
        if (document.exists()) {
            SnapPost snap = document.toObject(SnapPost.class);
            snap.setId(document.getId());
            return snap;
        }
        return null;
    }

    public void updateStatus(String id, String status) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(id).update("status", status);
    }
}
