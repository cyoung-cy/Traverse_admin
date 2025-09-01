package com.example.userauth.controller;

import com.example.userauth.dto.request.NotificationRequestDTO;
import com.example.userauth.dto.response.NotificationHistoryResponseDTO;
import com.example.userauth.dto.response.NotificationResponseDTO;
import com.example.userauth.service.NotificationHistoryService;
import com.example.userauth.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationHistoryService historyService;

    public NotificationController(NotificationService notificationService,
                                  NotificationHistoryService historyService) {
        this.notificationService = notificationService;
        this.historyService = historyService;
    }

    @PostMapping("/send")
    public ResponseEntity<NotificationResponseDTO> sendNotification(
            @RequestBody NotificationRequestDTO requestDTO
    ) throws ExecutionException, InterruptedException {
        NotificationResponseDTO response = notificationService.sendNotification(requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getNotificationHistory(
            @RequestParam int page,
            @RequestParam int limit,
            @RequestParam(required = false) String start_date,
            @RequestParam(required = false) String end_date
    ) throws ExecutionException, InterruptedException {
        Map<String, Object> response = notificationService.getNotificationHistory(page, limit, start_date, end_date);
        return ResponseEntity.ok(response);
    }


}

