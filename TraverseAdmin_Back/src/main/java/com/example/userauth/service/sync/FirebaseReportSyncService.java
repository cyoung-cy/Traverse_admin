package com.example.userauth.service.sync;

import com.example.userauth.model.ReportEntity;
import com.example.userauth.repository.NewReportCountRepository;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class FirebaseReportSyncService {

    private final NewReportCountRepository reportRepository;

    public FirebaseReportSyncService(NewReportCountRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public void syncReportsFromFirebase() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<QueryDocumentSnapshot> documents = db.collection("reports").get().get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            ReportEntity report = new ReportEntity();

            report.setReportId(doc.getId());
            report.setReportType(doc.getString("report_type"));
            report.setStatus(doc.getString("status"));
            report.setSeverity(getIntOrNull(doc, "severity"));
            report.setReason(doc.getString("reason"));
            report.setDescription(doc.getString("description"));
            report.setReporterUserId(doc.getString("reporter_user_id"));
            report.setReportedUserId(doc.getString("reported_user_id"));
            report.setReportedUserName(doc.getString("reported_user_name"));

            report.setPostId(doc.getString("post_id"));
            report.setPostContent(doc.getString("post_content"));

            report.setSnapId(doc.getString("snap_id"));
            report.setSnapContent(doc.getString("snap_content"));

            report.setCommentId(doc.getString("comment_id"));
            report.setParentCommentId(doc.getString("parent_comment_id"));
            report.setCommentContent(doc.getString("comment_content"));

            report.setChatId(doc.getString("chat_id"));
            report.setChatRoomId(doc.getString("chat_room_id"));
            report.setChatContent(doc.getString("chat_content"));

            if (doc.contains("created_at")) {
                Object createdAtObj = doc.get("created_at");
                if (createdAtObj instanceof com.google.cloud.Timestamp timestamp) {
                    report.setCreatedAt(timestamp.toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (createdAtObj instanceof String str) {
                    try {
                        report.setCreatedAt(LocalDateTime.parse(str));
                    } catch (Exception e) {
                        report.setCreatedAt(LocalDateTime.now());
                    }
                } else {
                    report.setCreatedAt(LocalDateTime.now());
                }
            } else {
                report.setCreatedAt(LocalDateTime.now());
            }


            report.setSyncedAt(LocalDateTime.now());

            reportRepository.save(report);
        }
    }

    private Integer getIntOrNull(QueryDocumentSnapshot doc, String field) {
        Long value = doc.getLong(field);
        return value != null ? value.intValue() : null;
    }
}
