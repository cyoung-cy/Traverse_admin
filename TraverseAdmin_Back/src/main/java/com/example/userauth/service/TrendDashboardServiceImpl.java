package com.example.userauth.service;

import com.example.userauth.dto.response.ContentTrendResponseDTO;
import com.example.userauth.dto.response.TrendResponseDTO;
import com.example.userauth.dto.response.UserTrendResponseDTO;
import com.example.userauth.model.PostEntity;
import com.example.userauth.model.SnapPostEntity;
import com.example.userauth.repository.*;
import com.example.userauth.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TrendDashboardServiceImpl implements TrendDashboardService {

    private final TrendSnapshotRepository trendSnapshotRepository;
    private final NewUserCountRepository userCountRepo;
    private final NewPostCountRepository postCountRepo;
    private final NewReportCountRepository reportCountRepo;
    private final NewSnapPostCountRepository snapPostCountRepo;
    private final DateUtil dateUtil;
    private final FirebaseService firebaseService;

    @Override
    public TrendResponseDTO getTrends(String startDate, String endDate, String interval) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        LocalDate today = LocalDate.now();

        List<LocalDate> intervals = generateDateIntervals(start, end, interval);
        List<TrendResponseDTO.TrendItem> trends = new ArrayList<>();

        for (LocalDate currentDate : intervals) {
            LocalDate prevDate = currentDate.minusDays(1);
            TrendResponseDTO.TrendItem item = new TrendResponseDTO.TrendItem();
            item.setDate(currentDate.toString());

            if (currentDate.isEqual(today)) {
                // 🔹 오늘 = Firebase 기준
                LocalDateTime todayFrom = today.atStartOfDay();
                LocalDateTime todayTo = today.plusDays(1).atStartOfDay();

                int firebaseUsers = firebaseService.countUsersCreatedBetween(todayFrom, todayTo);
                int firebasePosts = firebaseService.countPostsCreatedBetween(todayFrom, todayTo);
                int firebaseSnapPosts = firebaseService.countSnapPostsCreatedBetween(todayFrom, todayTo);
                int firebaseReports = firebaseService.countReportsCreatedBetween(todayFrom, todayTo);

                int prevUsers = userCountRepo.countTotalUsersUntil(prevDate);
                int prevPosts = postCountRepo.countTotalPostsUntil(prevDate);
                int prevSnapPosts = snapPostCountRepo.countTotalSnapPostsUntil(prevDate);
                int prevReports = reportCountRepo.countTotalReportsUntil(prevDate);

                int newUsers = firebaseUsers;
                int newPosts = firebasePosts + firebaseSnapPosts;
                int newReports = firebaseReports;

                item.setNew_users(newUsers);
                item.setNew_posts(newPosts);
                item.setTotal_reports(newReports);

            } else {
                // 🔹 MySQL 기준
                int prevUsers = userCountRepo.countTotalUsersUntil(prevDate);
                int currUsers = userCountRepo.countTotalUsersUntil(currentDate);

                int prevPosts = postCountRepo.countTotalPostsUntil(prevDate);
                int currPosts = postCountRepo.countTotalPostsUntil(currentDate);

                int prevSnapPosts = snapPostCountRepo.countTotalSnapPostsUntil(prevDate);
                int currSnapPosts = snapPostCountRepo.countTotalSnapPostsUntil(currentDate);

                int prevReports = reportCountRepo.countTotalReportsUntil(prevDate);
                int currReports = reportCountRepo.countTotalReportsUntil(currentDate);

                int newUsers = currUsers - prevUsers;
                int newPosts = (currPosts + currSnapPosts) - (prevPosts + prevSnapPosts);
                int newReports = currReports - prevReports;

                item.setNew_users(newUsers);
                item.setNew_posts(newPosts);
                item.setTotal_reports(newReports);
            }

            trends.add(item);
        }

        // ✅ 만약 오늘(today)이 intervals에 포함되어 있지 않으면, 마지막에 오늘 데이터를 강제로 추가
        if (intervals.isEmpty() || !intervals.contains(today)) {
            LocalDate prevDate = today.minusDays(1);
            TrendResponseDTO.TrendItem item = new TrendResponseDTO.TrendItem();
            item.setDate(today.toString());

            LocalDateTime todayFrom = today.atStartOfDay();
            LocalDateTime todayTo = today.plusDays(1).atStartOfDay();

            int firebaseUsers = firebaseService.countUsersCreatedBetween(todayFrom, todayTo);
            int firebasePosts = firebaseService.countPostsCreatedBetween(todayFrom, todayTo);
            int firebaseSnapPosts = firebaseService.countSnapPostsCreatedBetween(todayFrom, todayTo);
            int firebaseReports = firebaseService.countReportsCreatedBetween(todayFrom, todayTo);

            int newUsers = firebaseUsers;
            int newPosts = firebasePosts + firebaseSnapPosts;
            int newReports = firebaseReports;

            item.setNew_users(newUsers);
            item.setNew_posts(newPosts);
            item.setTotal_reports(newReports);

            trends.add(item); // 마지막에 추가
        }

        TrendResponseDTO.TrendData data = new TrendResponseDTO.TrendData();
        data.setTrends(trends);

        TrendResponseDTO response = new TrendResponseDTO();
        response.setSuccess(true);
        response.setData(data);
        return response;
    }



    @Override
    public UserTrendResponseDTO getUserTrends(String startDate, String endDate, String interval) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<LocalDate> dateList = dateUtil.generateDateRange(start, end, interval);

        List<UserTrendResponseDTO.TrendItem> signupTrend = new ArrayList<>();
        List<UserTrendResponseDTO.TrendItem> activeTrend = new ArrayList<>();
        List<UserTrendResponseDTO.RetentionItem> retentionTrend = new ArrayList<>();

        for (LocalDate date : dateList) {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

            int newUsers = userCountRepo.countNewUsersByDate(startOfDay, endOfDay);
            int activeUsers = userCountRepo.countActiveUsersByDate(startOfDay, endOfDay);
            double retentionRate = userCountRepo.calculateRetentionRate(date);

            signupTrend.add(new UserTrendResponseDTO.TrendItem(date.toString(), newUsers));
            activeTrend.add(new UserTrendResponseDTO.TrendItem(date.toString(), activeUsers));
            retentionTrend.add(new UserTrendResponseDTO.RetentionItem(date.toString(), retentionRate));
        }


        // 연령 통계 변환
        List<UserTrendResponseDTO.AgeItem> ageItems = new ArrayList<>();
        List<Object[]> ageRaw = userCountRepo.getAgeStatsRaw();

// 정해진 연령대 순서
        Map<String, Integer> countMap = new HashMap<>();
        Map<String, Double> percentageMap = new HashMap<>();

        int totalAgeCount = ageRaw.stream().mapToInt(row -> ((Number) row[1]).intValue()).sum();

        for (Object[] row : ageRaw) {
            String range = (String) row[0];
            int count = ((Number) row[1]).intValue();
            double percentage = totalAgeCount == 0 ? 0.0 : ((double) count / totalAgeCount) * 100;
            countMap.put(range, count);
            percentageMap.put(range, percentage);
        }

        // 반드시 포함할 연령대
        List<String> ageRanges = List.of("10대", "20대", "30대", "40대 이상");

        for (String range : ageRanges) {
            int count = countMap.getOrDefault(range, 0);
            double percentage = percentageMap.getOrDefault(range, 0.0);
            ageItems.add(new UserTrendResponseDTO.AgeItem(range, count, percentage));
        }



        // 성별 통계 변환
        List<UserTrendResponseDTO.GenderItem> genderItems = new ArrayList<>();
        List<Object[]> genderRaw = userCountRepo.getGenderStatsRaw();
        int totalGenderCount = genderRaw.stream().mapToInt(row -> ((Number) row[1]).intValue()).sum();
        for (Object[] row : genderRaw) {
            String gender = (String) row[0];
            int count = ((Number) row[1]).intValue();
            double percentage = totalGenderCount == 0 ? 0.0 : ((double) count / totalGenderCount) * 100;
            genderItems.add(new UserTrendResponseDTO.GenderItem(gender, count, percentage));
        }

        // 지역 통계 변환
        List<UserTrendResponseDTO.LocationItem> locationItems = new ArrayList<>();
        List<Object[]> locationRaw = userCountRepo.getLocationStatsRaw();
        int totalLocationCount = locationRaw.stream().mapToInt(row -> ((Number) row[1]).intValue()).sum();
        for (Object[] row : locationRaw) {
            String location = (String) row[0];
            int count = ((Number) row[1]).intValue();
            double percentage = totalLocationCount == 0 ? 0.0 : ((double) count / totalLocationCount) * 100;
            locationItems.add(new UserTrendResponseDTO.LocationItem(location, count, percentage));
        }
        // 🔹 오늘 날짜 추가
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.plusDays(1).atStartOfDay();

        int todayNewUsers = userCountRepo.countNewUsersByDate(todayStart, todayEnd);
        int todayActiveUsers = userCountRepo.countActiveUsersByDate(todayStart, todayEnd);
        double todayRetention = userCountRepo.calculateRetentionRate(today);

        signupTrend.add(new UserTrendResponseDTO.TrendItem(today.toString(), todayNewUsers));
        activeTrend.add(new UserTrendResponseDTO.TrendItem(today.toString(), todayActiveUsers));
        retentionTrend.add(new UserTrendResponseDTO.RetentionItem(today.toString(), todayRetention));

        UserTrendResponseDTO.Demographics demographics = new UserTrendResponseDTO.Demographics();
        demographics.setBy_age(ageItems);
        demographics.setBy_gender(genderItems);
        demographics.setBy_location(locationItems);

        UserTrendResponseDTO.UserTrendData data = new UserTrendResponseDTO.UserTrendData();
        data.setSignup_trend(signupTrend);
        data.setActive_trend(activeTrend);
        data.setRetention_trend(retentionTrend);
        data.setUser_demographics(demographics);

        UserTrendResponseDTO response = new UserTrendResponseDTO();
        response.setSuccess(true);
        response.setData(data);

        return response;
    }


    @Override
    public ContentTrendResponseDTO getContentTrends(String startDate, String endDate, String interval) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        List<LocalDate> dateList = dateUtil.generateDateRange(start, end, interval); // 일/주/월 기준 날짜 범위 생성

        List<ContentTrendResponseDTO.TrendCountDTO> postTrend = new ArrayList<>();
        List<ContentTrendResponseDTO.TrendCountDTO> commentTrend = new ArrayList<>();
        List<ContentTrendResponseDTO.EngagementTrendDTO> engagementTrend = new ArrayList<>();

        for (LocalDate date : dateList) {
            // 해당 날짜에 해당하는 시간 범위 설정
            LocalDateTime from = date.atStartOfDay();
            LocalDateTime to = getIntervalEnd(from, interval);

            int postCount =
                    safe(postCountRepo.countPostsBetween(from, to)) +
                            safe(snapPostCountRepo.countSnapPostsBetween(from, to));

            int commentCount =
                    safe(postCountRepo.countCommentsBetween(from, to)) +
                            safe(snapPostCountRepo.countCommentsBetween(from, to));

            int likeCount =
                    safe(postCountRepo.countLikesBetween(from, to)) +
                            safe(snapPostCountRepo.countLikesBetween(from, to));
            int shareCount = 0; // 공유 수는 현재 구조상 없으므로 임시로 0

            postTrend.add(createTrendCountDTO(date, postCount));
            commentTrend.add(createTrendCountDTO(date, commentCount));
            engagementTrend.add(createEngagementTrendDTO(date, likeCount, commentCount, shareCount));
        }
        // 🔹 오늘 날짜 집계 추가
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = getIntervalEnd(todayStart, interval);

        int todayPostCount =
                safe(postCountRepo.countPostsBetween(todayStart, todayEnd)) +
                        safe(snapPostCountRepo.countSnapPostsBetween(todayStart, todayEnd));

        int todayCommentCount =
                safe(postCountRepo.countCommentsBetween(todayStart, todayEnd)) +
                        safe(snapPostCountRepo.countCommentsBetween(todayStart, todayEnd));

        int todayLikeCount =
                safe(postCountRepo.countLikesBetween(todayStart, todayEnd)) +
                        safe(snapPostCountRepo.countLikesBetween(todayStart, todayEnd));

        postTrend.add(createTrendCountDTO(today, todayPostCount));
        commentTrend.add(createTrendCountDTO(today, todayCommentCount));
        engagementTrend.add(createEngagementTrendDTO(today, todayLikeCount, todayCommentCount, 0));


        ContentTrendResponseDTO.TopContentDTO topContent = getTopContent(start, end);

        ContentTrendResponseDTO response = new ContentTrendResponseDTO();
        ContentTrendResponseDTO.ContentTrendDataDTO data = response.new ContentTrendDataDTO();

        data.setPost_trend(postTrend);
        data.setComment_trend(commentTrend);
        data.setEngagement_trend(engagementTrend);
        data.setTop_content(topContent);

        response.setData(data);
        return response;
    }

    private int safe(Integer value) {
        return value != null ? value : 0;
    }

    private List<LocalDate> generateDateIntervals(LocalDate start, LocalDate end, String interval) {
        List<LocalDate> intervals = new ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            intervals.add(current);
            switch (interval.toLowerCase()) {
                case "weekly": current = current.plusWeeks(1); break;
                case "monthly": current = current.plusMonths(1); break;
                default: current = current.plusDays(1); break;
            }
        }
        return intervals;
    }

    private LocalDateTime getIntervalEnd(LocalDateTime start, String interval) {
        return switch (interval.toLowerCase()) {
            case "daily" -> start.plusDays(1);
            case "weekly" -> start.plusWeeks(1);
            case "monthly" -> start.plusMonths(1);
            default -> throw new IllegalArgumentException("Invalid interval: " + interval);
        };
    }

    private ContentTrendResponseDTO.TrendCountDTO createTrendCountDTO(LocalDate date, int count) {
        ContentTrendResponseDTO.TrendCountDTO dto = new ContentTrendResponseDTO().new TrendCountDTO();
        dto.setDate(date.toString());
        dto.setCount(count);
        return dto;
    }

    private ContentTrendResponseDTO.EngagementTrendDTO createEngagementTrendDTO(LocalDate date, int likes, int comments, int shares) {
        ContentTrendResponseDTO.EngagementTrendDTO dto = new ContentTrendResponseDTO().new EngagementTrendDTO();
        dto.setDate(date.toString());
        dto.setLikes(likes);
        dto.setComments(comments);
        dto.setShares(shares);
        return dto;
    }

    private ContentTrendResponseDTO.TopContentDTO getTopContent(LocalDate start, LocalDate end) {
        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.plusDays(1).atStartOfDay();

        List<PostEntity> posts = postCountRepo.findTopPostsByEngagement(from, to);
        List<SnapPostEntity> snaps = snapPostCountRepo.findTopSnapsByEngagement(from, to);

        List<ContentTrendResponseDTO.PostSummaryDTO> topPosts = Stream.concat(posts.stream(), snaps.stream())
                .sorted(Comparator.comparingInt(this::calculateEngagement).reversed())
                .map(post -> {
                    ContentTrendResponseDTO.PostSummaryDTO dto = new ContentTrendResponseDTO().new PostSummaryDTO();
                    dto.setPost_id(getPostId(post));
                    dto.setTitle(getTitle(post));
                    dto.setEngagement(calculateEngagement(post));
                    return dto;
                })
                .collect(Collectors.toMap(
                        dto -> dto.getPost_id() + "_" + dto.getTitle(), // 중복 키 기준 확장
                        Function.identity(),
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ))
                .values()
                .stream()
                .limit(5)
                .collect(Collectors.toList());


        Map<String, Integer> hashtagUsage = new HashMap<>();
        posts.forEach(p -> p.getHashTags().forEach(tag -> hashtagUsage.merge(tag, 1, Integer::sum)));
        snaps.forEach(s -> s.getHashTags().forEach(tag -> hashtagUsage.merge(tag, 1, Integer::sum)));

        List<ContentTrendResponseDTO.HashtagDTO> topHashtags = hashtagUsage.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    ContentTrendResponseDTO.HashtagDTO dto = new ContentTrendResponseDTO().new HashtagDTO();
                    dto.setId(UUID.nameUUIDFromBytes(e.getKey().getBytes()).toString());
                    dto.setName(e.getKey());
                    dto.setUsage_count(e.getValue());
                    return dto;
                }).collect(Collectors.toList());

        ContentTrendResponseDTO.TopContentDTO topContent = new ContentTrendResponseDTO().new TopContentDTO();
        topContent.setPosts(topPosts);
        topContent.setHashtags(topHashtags);
        return topContent;
    }

    private int calculateEngagement(Object entity) {
        if (entity instanceof PostEntity post) {
            return post.getLikeCount() + post.getCommentCount();
        } else if (entity instanceof SnapPostEntity snap) {
            return snap.getLikeCount() + snap.getCommentCount();
        }
        return 0;
    }

    private String getPostId(Object entity) {
        if (entity instanceof PostEntity post) return "post_" + post.getPostId();
        if (entity instanceof SnapPostEntity snap) return "snap_" + snap.getSnapId();
        return "";
    }


    private String getTitle(Object entity) {
        if (entity instanceof PostEntity post) return post.getTitle();
        if (entity instanceof SnapPostEntity snap) return snap.getTitle();
        return "";
    }


}
