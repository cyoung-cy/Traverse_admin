package com.example.userauth.controller;

import com.example.userauth.dto.request.InquiryReplyDTO;
import com.example.userauth.dto.request.InquiryStatusUpdateDTO;
import com.example.userauth.service.InquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/admins/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    // 문의 내역 목록 조회 API
    @GetMapping
    public ResponseEntity<?> getInquiries(@RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int limit,
                                          @RequestParam(required = false) String status) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(inquiryService.getInquiries(page, limit, status));
    }

    // 문의 내역 상세 조회 API
    @GetMapping("/{inquiryId}")
    public ResponseEntity<?> getInquiryDetail(@PathVariable String inquiryId) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(inquiryService.getInquiryDetail(inquiryId));
    }

    // 문의 내역 상태 변경 API
    @PatchMapping("/{inquiryId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String inquiryId,
                                          @RequestBody InquiryStatusUpdateDTO dto) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(inquiryService.updateStatus(inquiryId, dto));
    }

    // 문의 내역 답장 API
    @PostMapping("/{inquiryId}/reply")
    public ResponseEntity<?> replyToInquiry(@PathVariable String inquiryId,
                                            @RequestBody InquiryReplyDTO dto) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(inquiryService.replyToInquiry(inquiryId, dto));
    }
}

