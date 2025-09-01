package com.example.userauth.service;

import com.example.userauth.dto.response.SnapDTO.*;
import com.example.userauth.dto.response.SnapDTO.SnapStatisticsResponse;
import com.example.userauth.model.SnapPost;
import com.example.userauth.repository.SnapPostRepository;
import com.google.cloud.Timestamp;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class SnapPostService {

    private final SnapPostRepository repository;
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public SnapPostService(SnapPostRepository repository) {
        this.repository = repository;
    }

    public SnapListPageResponse getSnapList(int page, int limit, String status, String sortBy, String sortOrder, String search) throws ExecutionException, InterruptedException {
        List<SnapPost> all = repository.findAll();

        // 상태 필터링
        if (status != null && !"all".equalsIgnoreCase(status)) {
            all = all.stream()
                    .filter(p -> status.equalsIgnoreCase(p.getStatus()))
                    .collect(Collectors.toList());
        }

        // 검색 필터링 (제목 기준)
        if (search != null && !search.isEmpty()) {
            all = all.stream()
                    .filter(p -> p.getTitle() != null && p.getTitle().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 정렬
        //Comparator<SnapPost> comparator;
        //if ("severity".equalsIgnoreCase(sortBy)) {
        //    comparator = Comparator.comparingInt(SnapPost::getSeverity);
        //} else {
        //    comparator = Comparator.comparing(p -> Optional.ofNullable(p.getCreated_at()).map(Timestamp::toDate).orElse(new Date(0)));
        //}
        Comparator<SnapPost> comparator = Comparator.comparing(
                p -> Optional.ofNullable(p.getCreated_at()).map(Timestamp::toDate).orElse(new Date(0))
        );


        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed();
        }

        all.sort(comparator);

        // 전체 개수 계산
        int total = all.size();
        int start = Math.min((page - 1) * limit, total);
        int end = Math.min(start + limit, total);

        // 페이징
        List<SnapListResponse> list = new ArrayList<>();
        for (SnapPost post : all.subList(start, end)) {
            SnapListResponse dto = new SnapListResponse();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setUser_id(post.getUser_id());
            dto.setStatus(post.getStatus());

            // created_at 문자열 포맷
            Timestamp createdAt = post.getCreated_at();
            dto.setCreated_at(createdAt != null ? sdf.format(createdAt.toDate()) : null);

            dto.setImage_url(post.getSnap_images() != null && !post.getSnap_images().isEmpty() ? post.getSnap_images().get(0) : null);
            dto.setLike_count(post.getLike_count());
            dto.setView_count(post.getView_count());
            dto.setCaptions(post.getCaptions());
            dto.setHash_tags(post.getHash_tags());
            dto.setSnap_images(post.getSnap_images());
            dto.setComment_count(post.getComment_count());
            list.add(dto);
        }

        // 응답 생성
        SnapListPageResponse response = new SnapListPageResponse();
        response.setSnaps(list);
        response.setTotal_count(total);
        response.setCurrent_page(page);
        response.setLimit(limit);
        response.setTotal_pages((int) Math.ceil((double) total / limit));
        return response;
    }

    public SnapDetailResponse getSnapDetail(String id) throws ExecutionException, InterruptedException {
        SnapPost post = repository.findById(id);
        if (post == null) return null;

        SnapDetailResponse dto = new SnapDetailResponse();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setUser_id(post.getUser_id());
        dto.setStatus(post.getStatus());

        Timestamp createdAt = post.getCreated_at();
        dto.setCreated_at(createdAt != null ? sdf.format(createdAt.toDate()) : null);

        dto.setSnap_images(post.getSnap_images());
        dto.setLike_count(post.getLike_count());
        dto.setView_count(post.getView_count());
        dto.setCaptions(post.getCaptions());
        dto.setHash_tags(post.getHash_tags());
        dto.setComment_count(post.getComment_count());
        return dto;
    }

    public SnapStatusUpdateResponse updateSnapStatus(String id, String newStatus) {
        repository.updateStatus(id, newStatus);
        SnapStatusUpdateResponse response = new SnapStatusUpdateResponse();
        response.setId(id);
        response.setStatus(newStatus);
        response.setUpdated_at(String.valueOf(System.currentTimeMillis()));
        return response;
    }

    public SnapStatisticsResponse getSnapStatistics() {
        List<SnapPost> all = null;
        try {
            all = repository.findAll();
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        int total = all.size();
        int active = 0;
        int hidden = 0; // 명세에는 hidden 상태가 있지만 기존 코드엔 없어서 0으로 둠
        int deleted = 0;

        for (SnapPost post : all) {
            String status = post.getStatus();
            if ("active".equalsIgnoreCase(status)) {
                active++;
            } else if ("hidden".equalsIgnoreCase(status)) {
                hidden++;
            } else if ("deleted".equalsIgnoreCase(status)) {
                deleted++;
            }
        }

        SnapStatisticsResponse response = new SnapStatisticsResponse();
        response.setTotal(total);
        response.setActive(active);
        response.setHidden(hidden);
        response.setDeleted(deleted);

        return response;
    }

}
