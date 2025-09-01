package com.example.userauth.service.sync;

import com.example.userauth.model.PostEntity;
import com.example.userauth.repository.NewPostCountRepository;
import com.example.userauth.repository.NewSnapPostCountRepository;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class FirebasePostSyncService {

    private final NewPostCountRepository postRepository;

    public FirebasePostSyncService(NewPostCountRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void syncPostsFromFirebase() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = db.collection("Post").get().get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            PostEntity post = new PostEntity();

            post.setPostId(doc.getId());
            post.setUserId(doc.getString("user_id"));
            post.setUid(doc.getString("uid"));
            post.setTitle(doc.getString("title"));
            post.setPostContent(doc.getString("post_content"));
            post.setProfileImageUrl(doc.getString("profile_image_url"));
            post.setCountryCode(doc.getString("country_code"));
            post.setLocation(doc.getString("location"));

            // 댓글, 좋아요, 신고, 조회 수
            post.setCommentCount(getIntOrDefault(doc, "comment_count"));
            post.setLikeCount(getIntOrDefault(doc, "like_count"));
            post.setReportCount(getIntOrDefault(doc, "report_count"));
            post.setViewCount(getIntOrDefault(doc, "view_count"));

            // List<String> 처리
            if (doc.contains("post_images")) {
                post.setPostImages((List<String>) doc.get("post_images"));
            }
            if (doc.contains("hash_tags")) {
                post.setHashTags((List<String>) doc.get("hash_tags"));
            }
            if (doc.contains("liked_profiles")) {
                post.setLikedProfiles((List<String>) doc.get("liked_profiles"));
            }

            if (doc.contains("created_at")) {
                Object createdAtObj = doc.get("created_at");
                if (createdAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    post.setCreatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (createdAtObj instanceof String str) {
                    try {
                        post.setCreatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        post.setCreatedAt(LocalDateTime.now());
                    }
                } else {
                    post.setCreatedAt(LocalDateTime.now());
                }
            } else {
                post.setCreatedAt(LocalDateTime.now());
            }


            post.setSyncedAt(LocalDateTime.now());
            postRepository.save(post);
        }
    }

    private int getIntOrDefault(QueryDocumentSnapshot doc, String field) {
        Long value = doc.getLong(field);
        return value != null ? value.intValue() : 0;
    }
}
