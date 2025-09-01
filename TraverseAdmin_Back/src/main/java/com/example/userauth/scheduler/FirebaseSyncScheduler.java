package com.example.userauth.scheduler;

import com.example.userauth.service.TrendSchedulerService;
import com.example.userauth.service.sync.FirebasePostSyncService;
import com.example.userauth.service.sync.FirebaseReportSyncService;
import com.example.userauth.service.sync.FirebaseSnapPostSyncService;
import com.example.userauth.service.sync.FirebaseUserSyncService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class FirebaseSyncScheduler {

    private final FirebaseUserSyncService userSyncService;
    private final FirebasePostSyncService postSyncService;
    private final FirebaseSnapPostSyncService snapPostSyncService;
    private final FirebaseReportSyncService reportSyncService;
    private final TrendSchedulerService trendSchedulerService;

    public FirebaseSyncScheduler(FirebaseUserSyncService userSyncService,
                                 FirebasePostSyncService postSyncService,
                                 FirebaseSnapPostSyncService snapPostSyncService,
                                 FirebaseReportSyncService reportSyncService,
                                 TrendSchedulerService trendSchedulerService) {
        this.userSyncService = userSyncService;
        this.postSyncService = postSyncService;
        this.snapPostSyncService = snapPostSyncService;
        this.reportSyncService = reportSyncService;
        this.trendSchedulerService = trendSchedulerService;
    }
    //@Scheduled(cron = "0 59 23 * * *")
    @Scheduled(cron = "0 59 23 * * *")
    public void syncAllDataFromFirebase() throws Exception {
        userSyncService.syncUsersFromFirebase();
        postSyncService.syncPostsFromFirebase();
        snapPostSyncService.syncSnapPostsFromFirebase();
        reportSyncService.syncReportsFromFirebase();
        // 데이터 동기화 후 통계 저장
        trendSchedulerService.syncDailyTrends();
    }
}
