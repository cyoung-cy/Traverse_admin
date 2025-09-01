package com.example.userauth.service.sync;

import com.example.userauth.model.UserEntity;
import com.example.userauth.repository.NewUserCountRepository;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FirebaseUserSyncService {

    private final NewUserCountRepository userRepository;

    public FirebaseUserSyncService(NewUserCountRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void syncUsersFromFirebase() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = db.collection("users").get().get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            UserEntity user = new UserEntity();

            user.setUserId(doc.getId());
            String userName = doc.getString("user_name");
            if (userName == null || userName.trim().isEmpty()) {
                System.out.println("[WARN] Missing user_name for docId: " + doc.getId());
                userName = "unknown_user"; // or skip saving this user
            }
            user.setUserName(userName);

            user.setEmail(doc.getString("email"));
            user.setPasswordHash(doc.getString("password_hash"));
            user.setPhoneNumber(doc.getString("phone_number"));
            user.setGender(doc.getString("gender"));

            if (doc.contains("birthdate")) {
                Object birthdateObj = doc.get("birthdate");
                if (birthdateObj instanceof Timestamp timestamp) {
                    user.setBirthdate(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDate());
                } else if (birthdateObj instanceof String str) {
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                        user.setBirthdate(LocalDate.parse(str, formatter));
                    } catch (Exception e) {
                        System.out.println("[WARN] Invalid birthdate format for user: " + doc.getId() + " → " + str);
                        user.setBirthdate(null);
                    }
                } else {
                    user.setBirthdate(null);
                }
            }

            user.setBio(doc.getString("bio"));
            user.setProfilePicture(doc.getString("profile_picture"));
            user.setFcmToken(doc.getString("fcm_token"));
            user.setFollowerCount(doc.getLong("follower_count") != null ? doc.getLong("follower_count").intValue() : 0);
            user.setFollowingCount(doc.getLong("following_count") != null ? doc.getLong("following_count").intValue() : 0);

            if (doc.contains("created_at")) {
                Object createdAtObj = doc.get("created_at");
                if (createdAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    user.setCreatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (createdAtObj instanceof String str) {
                    try {
                        user.setCreatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        user.setCreatedAt(LocalDateTime.now());
                    }
                } else {
                    user.setCreatedAt(LocalDateTime.now());
                }
            } else {
                user.setCreatedAt(LocalDateTime.now());
            }

            if (doc.contains("tokenUpdatedAt")) {
                Object tokenUpdatedAtObj = doc.get("tokenUpdatedAt");
                if (tokenUpdatedAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    user.setTokenUpdatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (tokenUpdatedAtObj instanceof String str) {
                    try {
                        user.setTokenUpdatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        user.setTokenUpdatedAt(null); // 실패 시 null 또는 원하는 기본값
                    }
                }
            }

            //if (doc.contains("interest_keywords")) {
            //    List<String> keywords = (List<String>) doc.get("interest_keywords");
            //    user.setInterestKeywords(keywords);
            //}
            user.setSyncedAt(LocalDateTime.now());
            userRepository.save(user); // 정상 작동
        }
    }
}
