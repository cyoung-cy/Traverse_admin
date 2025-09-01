package com.example.userauth.service.sync;

import com.example.userauth.model.SnapPostEntity;
import com.example.userauth.repository.NewSnapPostCountRepository;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class FirebaseSnapPostSyncService {

    private final NewSnapPostCountRepository snapPostRepository;

    public FirebaseSnapPostSyncService(NewSnapPostCountRepository snapPostRepository) {
        this.snapPostRepository = snapPostRepository;
    }

    public void syncSnapPostsFromFirebase() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = db.collection("SnapPost").get().get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            SnapPostEntity snapPost = new SnapPostEntity();

            snapPost.setSnapId(doc.getId());
            snapPost.setUserId(doc.getString("user_id"));
            snapPost.setUid(doc.getString("uid"));
            snapPost.setTitle(doc.getString("title"));
            snapPost.setCountryCode(doc.getString("country_code"));
            snapPost.setProfileImageurl(doc.getString("profile_image_url"));

            snapPost.setCommentCount(getIntOrDefault(doc, "comment_count"));
            snapPost.setLikeCount(getIntOrDefault(doc, "like_count"));
            snapPost.setViewCount(getIntOrDefault(doc, "view_count"));

            // 리스트 필드 처리
            if (doc.contains("captions")) {
                snapPost.setCaptions((List<String>) doc.get("captions"));
            }
            if (doc.contains("snap_images")) {
                snapPost.setSnapImages((List<String>) doc.get("snap_images"));
            }
            if (doc.contains("hash_tags")) {
                snapPost.setHashTags((List<String>) doc.get("hash_tags"));
            }

            // 날짜 필드 처리
            if (doc.contains("created_at")) {
                Object createdAtObj = doc.get("created_at");
                if (createdAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    snapPost.setCreatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (createdAtObj instanceof String str) {
                    try {
                        snapPost.setCreatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        snapPost.setCreatedAt(LocalDateTime.now());
                    }
                } else {
                    snapPost.setCreatedAt(LocalDateTime.now());
                }
            } else {
                snapPost.setCreatedAt(LocalDateTime.now());
            }

            if (doc.contains("updated_at")) {
                Object updatedAtObj = doc.get("updated_at");
                if (updatedAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    snapPost.setUpdatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (updatedAtObj instanceof String str) {
                    try {
                        snapPost.setUpdatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        snapPost.setUpdatedAt(null); // 실패 시 null 또는 기본값
                    }
                }
            }


            snapPost.setSyncedAt(LocalDateTime.now());
            snapPostRepository.save(snapPost);
        }
    }

    private int getIntOrDefault(QueryDocumentSnapshot doc, String field) {
        Long value = doc.getLong(field);
        return value != null ? value.intValue() : 0;
    }
}
