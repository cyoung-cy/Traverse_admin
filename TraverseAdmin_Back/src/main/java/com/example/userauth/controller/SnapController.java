package com.example.userauth.controller;

import com.example.userauth.dto.request.SnapStatusUpdateRequest;
import com.example.userauth.dto.response.SnapDTO.*;
import com.example.userauth.service.SnapPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/snaps")
@RequiredArgsConstructor
public class SnapController {

    private final SnapPostService snapService;

    // 13.1 스냅 목록 조회
    @GetMapping
    public Map<String, Object> getSnaps(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "created_at") String sort_by,
            @RequestParam(defaultValue = "desc") String sort_order,
            @RequestParam(required = false) String search
    ) throws ExecutionException, InterruptedException {
        SnapListPageResponse data = snapService.getSnapList(page, limit, status, sort_by, sort_order, search);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    // 13.2 스냅 상세 조회
    @GetMapping("/{snap_id}")
    public Map<String, Object> getSnapDetail(@PathVariable("snap_id") String snapId) throws ExecutionException, InterruptedException {
        SnapDetailResponse data = snapService.getSnapDetail(snapId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    // 13.3 스냅 상태 변경
    @PatchMapping("/{snap_id}/status")
    public Map<String, Object> updateSnapStatus(
            @PathVariable("snap_id") String snapId,
            @RequestBody SnapStatusUpdateRequest request
    ) {
        SnapStatusUpdateResponse data = snapService.updateSnapStatus(snapId, request.getStatus());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    // 13.4 스냅 통계 대시보드 데이터
    @GetMapping("/statistics")
    public Map<String, Object> getSnapStatistics() throws ExecutionException, InterruptedException {
        // 통계 서비스 메서드가 없으므로 임시로 구현 (서비스에 구현 필요)
        SnapStatisticsResponse data = snapService.getSnapStatistics();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }
}
