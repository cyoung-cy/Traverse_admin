package com.example.userauth.service;

import com.example.userauth.model.Hashtag;
import com.example.userauth.model.Hashtag.RelatedHashtag;
import com.example.userauth.repository.HashtagRepository;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class HashtagService {

    private final HashtagRepository hashtagRepository;
    private static final Firestore db = FirestoreClient.getFirestore();

    @Autowired
    public HashtagService(HashtagRepository hashtagRepository) {
        this.hashtagRepository = hashtagRepository;
    }

    // 전체 해시태그 수를 Firestore에서 조회하는 메서드
    @SneakyThrows
    public int getTotalHashtagsCount() {
        CollectionReference hashtagCollection = db.collection("hashtags");  // Firestore에서 hashtags 컬렉션을 가져옵니다.
        QuerySnapshot snapshot = hashtagCollection.get().get(); // 전체 데이터를 가져옵니다.
        return snapshot.getDocuments().size(); // 문서 수를 반환하여 전체 해시태그 수를 계산합니다.
    }

    // 해시태그 목록 조회
    public List<Hashtag> getHashtags(int page, int limit, String search, String sortBy, String sortOrder, String type) {
        return hashtagRepository.findHashtags(page, limit, search, sortBy, sortOrder, type);
    }

    // 해시태그 상세 조회
    public Hashtag getHashtagDetails(String hashtag_id) {
        return hashtagRepository.findHashtagById(hashtag_id);
    }

    // 관련 해시태그 조회
    public List<RelatedHashtag> getRelatedHashtags(String hashtagName) {
        List<Hashtag> allHashtags = hashtagRepository.findAll(); // 모든 해시태그를 가져옴
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
        // 이름에 포함된 키워드를 기준으로 연관 여부를 판단 (간단한 예시)
        return targetName.contains(hashtagName) || hashtagName.contains(targetName);
    }

    // 연관성 계산 (예시로 사용 횟수 기준)
    private float calculateCorrelation(String hashtagName, String targetName) {
        // 예시로, 두 해시태그의 사용횟수 차이를 연관성으로 계산
        // 실제로는 더 복잡한 로직이 필요할 수 있음
        return Math.abs(hashtagName.length() - targetName.length()); // 간단한 예시: 길이 차이로 연관성 계산
    }

    // 트렌드 데이터 조회 (예제 데이터, 실제 구현 시 DB에서 가져오도록 수정 가능)
    public List<Map<String, Object>> getTrendData(String hashtagId) {
        List<Map<String, Object>> trendData = new ArrayList<>();

        for (int i = 0; i < 7; i++) { // 최근 7일치 트렌드 데이터
            Map<String, Object> dailyTrend = new HashMap<>();
            dailyTrend.put("date", Instant.now().minusSeconds(i * 86400).toString()); // 하루 단위 감소
            dailyTrend.put("count", (int) (Math.random() * 100)); // 랜덤 사용량 (테스트 데이터)
            trendData.add(dailyTrend);
        }

        return trendData;
    }

    // 인기 게시글 조회 (예제 데이터, 실제 구현 시 DB에서 가져오도록 수정 가능)
    public List<Map<String, Object>> getTopPosts(String hashtagId) {
        List<Map<String, Object>> topPosts = new ArrayList<>();

        for (int i = 0; i < 3; i++) { // 상위 3개의 인기 게시글
            Map<String, Object> post = new HashMap<>();
            post.put("post_id", "post_" + (i + 1));
            post.put("title", "인기 게시글 " + (i + 1));
            post.put("like_count", (int) (Math.random() * 500)); // 랜덤 좋아요 수 (테스트 데이터)
            topPosts.add(post);
        }

        return topPosts;
    }

    // calculateStartDate 메서드 정의
    public Instant calculateStartDate(String period) {
        // period가 "month"인 경우, 한 달 전 날짜를 반환
        if ("month".equalsIgnoreCase(period)) {
            return LocalDate.now().minusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        }
        // period가 "week"인 경우, 일주일 전 날짜를 반환
        else if ("week".equalsIgnoreCase(period)) {
            return LocalDate.now().minusWeeks(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        }
        // period가 "day"인 경우, 하루 전 날짜를 반환
        else if ("day".equalsIgnoreCase(period)) {
            return LocalDate.now().minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        }
        // period가 주어지지 않았거나 다른 값인 경우, 기본적으로 오늘 날짜를 반환
        else {
            return Instant.now();
        }
    }

    // 해시태그 워드 클라우드 데이터 조회
    @SneakyThrows
    // 예시: 응답 데이터를 더 잘게 나누어 반환하는 방법
    public List<Map<String, Object>> getHashtagWordCloud(String period, int limit) {
        CollectionReference hashtagCollection = db.collection("hashtags");

        Instant startDate = calculateStartDate(period);
        Date start = Date.from(startDate);

        QuerySnapshot snapshot = hashtagCollection
                .whereGreaterThan("last_used_at", start)
                .get()
                .get();

        Map<String, Integer> hashtagCounts = new HashMap<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            String hashtagName = doc.getString("name");
            Integer usageCount = doc.getLong("usage_count").intValue();
            hashtagCounts.put(hashtagName, hashtagCounts.getOrDefault(hashtagName, 0) + usageCount);
        }

        List<Map<String, Object>> wordCloudData = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : hashtagCounts.entrySet()) {
            Map<String, Object> hashtagData = new HashMap<>();
            hashtagData.put("id", UUID.randomUUID().toString());
            hashtagData.put("name", entry.getKey());
            hashtagData.put("weight", entry.getValue());
            wordCloudData.add(hashtagData);
        }

        wordCloudData.sort((a, b) -> Integer.compare((int) b.get("weight"), (int) a.get("weight")));

        if (wordCloudData.size() > limit) {
            wordCloudData = wordCloudData.subList(0, limit);
        }

        // 응답 크기가 큰 경우에는 데이터 페이지네이션을 도입하거나, 로그 출력을 간략화하는 방법도 고려해보세요.
        return wordCloudData;
    }

    // 해시태그 상태 변경
    public boolean updateHashtagStatus(String id, String status, String reason) {
        // 해시태그 조회
        Optional<Hashtag> optionalHashtag = hashtagRepository.findById(id);

        if (optionalHashtag.isPresent()) {
            Hashtag hashtag = optionalHashtag.get();
            // 상태 변경
            hashtag.setStatus(status);
            hashtag.setReason(reason);
            // 상태 변경된 해시태그 저장
            hashtagRepository.save(hashtag);
            return true; // 상태 변경 성공
        } else {
            return false; // 해시태그가 없으면 실패
        }
    }

    public Map<String, Object> getHashtagStatistics(String startDate, String endDate) throws ExecutionException, InterruptedException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate today = LocalDate.now();

        if (startDate == null || endDate == null) {
            startDate = today.minusDays(7).toString();
            endDate = today.toString();
        }

        Instant startInstant = LocalDate.parse(startDate).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = LocalDate.parse(endDate).atStartOfDay(ZoneId.systemDefault()).toInstant();

        Instant todayStart = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant todayEnd = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        CollectionReference hashtagCollection = db.collection("hashtags");
        QuerySnapshot snapshot = hashtagCollection
                .whereGreaterThanOrEqualTo("created_at", Date.from(startInstant))
                .whereLessThanOrEqualTo("created_at", Date.from(endInstant))
                .get()
                .get();

        int totalHashtags = hashtagCollection.get().get().size();
        int newHashtags = 0;
        List<Map<String, Object>> allHashtags = new ArrayList<>();
        List<Map<String, Object>> hashtagTrend = new ArrayList<>();

        Map<String, Integer> hashtagCountByDate = new TreeMap<>();
        Map<String, Integer> newHashtagCountByDate = new TreeMap<>();

        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            String name = doc.getString("name");
            Long usageCount = doc.getLong("usage_count");
            Date createdAt = doc.getDate("created_at");

            if (createdAt != null) {
                Instant created = createdAt.toInstant();

                if (!created.isBefore(todayStart) && created.isBefore(todayEnd)) {
                    newHashtags++;
                }

                String createdDateStr = dateFormat.format(createdAt);
                hashtagCountByDate.put(createdDateStr, hashtagCountByDate.getOrDefault(createdDateStr, 0) + 1);
                newHashtagCountByDate.put(createdDateStr, newHashtagCountByDate.getOrDefault(createdDateStr, 0) + 1);
            }

            allHashtags.add(Map.of(
                    "id", doc.getId(),
                    "name", name,
                    "growth_rate", Math.random() * 0.1,
                    "usage_count", usageCount != null ? usageCount : 0
            ));
        }

        // ✅ usage_count 기준 내림차순 정렬 후 상위 10개 추출
        List<Map<String, Object>> trendingHashtags = allHashtags.stream()
                .sorted((a, b) -> Long.compare(
                        ((Number) b.get("usage_count")).longValue(),
                        ((Number) a.get("usage_count")).longValue()
                ))
                .limit(10)
                .collect(Collectors.toList());

        for (String date : hashtagCountByDate.keySet()) {
            hashtagTrend.add(Map.of(
                    "date", date,
                    "count", hashtagCountByDate.get(date),
                    "new_count", newHashtagCountByDate.get(date)
            ));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("total_hashtags", totalHashtags);
        result.put("new_hashtags", newHashtags);
        result.put("trending_hashtags", trendingHashtags); // ✅ usage_count 기준 정렬된 상위 해시태그
        result.put("hashtag_trend", hashtagTrend);

        System.out.println("Hashtag Statistics Response: " + result);
        return result;
    }



}

