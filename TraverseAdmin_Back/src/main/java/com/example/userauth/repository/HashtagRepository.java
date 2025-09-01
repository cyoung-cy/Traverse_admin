package com.example.userauth.repository;

import com.example.userauth.model.Hashtag;
import com.example.userauth.model.Hashtag.RelatedHashtag;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class HashtagRepository {


    private final Firestore firestore;

    @Autowired
    public HashtagRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // 해시태그 목록 조회
    public List<Hashtag> findHashtags(int page, int limit, String search, String sortBy, String sortOrder, String type) {
        CollectionReference hashtagsRef = firestore.collection("hashtags");

        // 기본적으로 쿼리
        Query query = hashtagsRef;

        // 검색어 필터
        if (search != null && !search.isEmpty()) {
            query = query.whereEqualTo("name", search);
        }

        // 정렬
        if ("usage_count".equals(sortBy)) {
            query = query.orderBy("usage_count", "asc".equals(sortOrder) ? Query.Direction.ASCENDING : Query.Direction.DESCENDING);
        } else if ("created_at".equals(sortBy)) {
            query = query.orderBy("created_at", "asc".equals(sortOrder) ? Query.Direction.ASCENDING : Query.Direction.DESCENDING);
        }

        // 페이징 처리
        query = query.limit(limit).offset((page - 1) * limit);

        // 결과 조회 후 반환
        try {
            List<Hashtag> hashtags = query.get().get().toObjects(Hashtag.class);
            return hashtags;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 해시태그 상세 조회
    public Hashtag findHashtagById(String hashtag_id) {
        DocumentReference hashtagRef = firestore.collection("hashtags").document(hashtag_id);
        try {
            DocumentSnapshot documentSnapshot = hashtagRef.get().get();
            if (documentSnapshot.exists()) {
                return documentSnapshot.toObject(Hashtag.class);
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 모든 해시태그 조회 (findAll 구현)
    public List<Hashtag> findAll() {
        CollectionReference hashtagsRef = firestore.collection("hashtags");
        try {
            List<Hashtag> hashtags = new ArrayList<>();
            ApiFuture<QuerySnapshot> future = hashtagsRef.get();
            QuerySnapshot querySnapshot = future.get();
            for (DocumentSnapshot documentSnapshot : querySnapshot.getDocuments()) {
                Hashtag hashtag = documentSnapshot.toObject(Hashtag.class);
                if (hashtag != null) {
                    hashtags.add(hashtag);
                }
            }
            return hashtags;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 관련 해시태그 조회 (예시로 사용)
    public List<RelatedHashtag> findRelatedHashtags(String hashtagName) {
        List<Hashtag> allHashtags = findAll(); // 모든 해시태그를 가져옴
        List<RelatedHashtag> relatedHashtags = new ArrayList<>();

        for (Hashtag hashtag : allHashtags) {
            if (isRelated(hashtag.getName(), hashtagName)) {
                // 연관성 계산 (예시로 사용횟수를 기준으로 계산)
                float correlation = calculateCorrelation(hashtagName, hashtag.getName());
                RelatedHashtag relatedHashtag = new RelatedHashtag();
                relatedHashtag.setId(hashtag.getId());
                relatedHashtag.setName(hashtag.getName());
                relatedHashtag.setUsage_count(hashtag.getUsage_count());
                relatedHashtag.setCorrelation(correlation);
                relatedHashtags.add(relatedHashtag);
            }
        }

        return relatedHashtags;
    }

    // 두 해시태그 이름이 연관성이 있는지 확인하는 간단한 로직 (예시)
    private boolean isRelated(String hashtagName, String targetName) {
        return targetName.contains(hashtagName) || hashtagName.contains(targetName);
    }

    // 연관성 계산 (예시로 사용 횟수 기준)
    private float calculateCorrelation(String hashtagName, String targetName) {
        return Math.abs(hashtagName.length() - targetName.length()); // 예시: 길이 차이로 연관성 계산
    }

    public Optional<Hashtag> findById(String id) {
        DocumentReference hashtagRef = firestore.collection("hashtags").document(id);
        try {
            DocumentSnapshot documentSnapshot = hashtagRef.get().get();
            if (documentSnapshot.exists()) {
                Hashtag hashtag = documentSnapshot.toObject(Hashtag.class);
                return Optional.of(hashtag);
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public void save(Hashtag hashtag) {
        CollectionReference hashtagsRef = firestore.collection("hashtags");
        try {
            DocumentReference hashtagRef = hashtagsRef.document(hashtag.getId()); // ID가 이미 존재하면 해당 문서 업데이트
            hashtagRef.set(hashtag).get(); // 해시태그 객체를 Firestore에 저장
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
