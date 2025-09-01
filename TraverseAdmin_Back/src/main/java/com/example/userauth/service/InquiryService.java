package com.example.userauth.service;

import com.example.userauth.dto.request.InquiryReplyDTO;
import com.example.userauth.dto.request.InquiryStatusUpdateDTO;
import com.example.userauth.repository.InquiryRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    public Map<String, Object> getInquiries(int page, int limit, String status) throws ExecutionException, InterruptedException {
        Query query = inquiryRepository.getInquiries().orderBy("created_at", Query.Direction.DESCENDING);
        if (status != null && !"all".equalsIgnoreCase(status) && !status.isEmpty()) {
            query = query.whereEqualTo("status", status);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        int total = documents.size();
        int fromIndex = (page - 1) * limit;
        int toIndex = Math.min(fromIndex + limit, total);

        List<Map<String, Object>> inquiries = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents.subList(fromIndex, toIndex)) {
            Map<String, Object> data = doc.getData();

            Object createdAtObj = data.get("created_at");
            if (createdAtObj instanceof com.google.cloud.Timestamp) {
                com.google.cloud.Timestamp ts = (com.google.cloud.Timestamp) createdAtObj;
                data.put("created_at", ts.toDate().toInstant().toString());
            }

            data.put("id", doc.getId());
            inquiries.add(data);
        }

        return Map.of(
                "success", true,
                "data", Map.of(
                        "total", total,
                        "page", page,
                        "limit", limit,
                        "inquiries", inquiries
                )
        );
    }


    public Map<String, Object> getInquiryDetail(String inquiryId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = inquiryRepository.getInquiryById(inquiryId).get().get();
        if (!doc.exists()) return Map.of("success", false, "error", "문의를 찾을 수 없습니다.");

        Map<String, Object> data = doc.getData();

        // created_at 변환
        Object createdAtObj = data.get("created_at");
        if (createdAtObj instanceof com.google.cloud.Timestamp) {
            com.google.cloud.Timestamp ts = (com.google.cloud.Timestamp) createdAtObj;
            data.put("created_at", ts.toDate().toInstant().toString());
        }

        // answer 안의 answered_at 도 변환
        Object answerObj = data.get("answer");
        if (answerObj instanceof Map) {
            Map<String, Object> answerMap = (Map<String, Object>) answerObj;
            Object answeredAtObj = answerMap.get("answered_at");
            if (answeredAtObj instanceof com.google.cloud.Timestamp) {
                com.google.cloud.Timestamp ts = (com.google.cloud.Timestamp) answeredAtObj;
                answerMap.put("answered_at", ts.toDate().toInstant().toString());
            }
        }

        data.put("id", doc.getId());

        return Map.of("success", true, "data", data);
    }


    public Map<String, Object> updateStatus(String inquiryId, InquiryStatusUpdateDTO dto) throws ExecutionException, InterruptedException {
        DocumentReference ref = inquiryRepository.getInquiryById(inquiryId);
        ref.update("status", dto.getStatus()).get();
        return Map.of("success", true, "message", "문의 상태가 업데이트되었습니다.");
    }

    public Map<String, Object> replyToInquiry(String inquiryId, InquiryReplyDTO dto) throws ExecutionException, InterruptedException {
        Map<String, Object> answer = Map.of(
                "admin_id", dto.getAdmin_id(),
                "message", dto.getMessage(),
                "answered_at", Timestamp.now()
        );

        DocumentReference ref = inquiryRepository.getInquiryById(inquiryId);
        ref.update(Map.of(
                "status", "answered",
                "answer", answer
        )).get();

        return Map.of("success", true, "message", "답변이 등록되었습니다.");
    }
}
