package com.example.userauth.service;

import com.example.userauth.model.TrendSnapshot;
import com.example.userauth.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class TrendSchedulerService {

    private final TrendSnapshotRepository trendSnapshotRepository;
    private final NewUserCountRepository newUserCountRepository;
    private final NewPostCountRepository newPostCountRepository;
    private final NewSnapPostCountRepository newSnapPostCountRepository;
    private final NewReportCountRepository newReportCountRepository;

    public TrendSchedulerService(TrendSnapshotRepository trendSnapshotRepository,
                                 NewUserCountRepository newUserCountRepository,
                                 NewPostCountRepository newPostCountRepository,
                                 NewSnapPostCountRepository newSnapPostCountRepository,
                                 NewReportCountRepository newReportCountRepository) {
        this.trendSnapshotRepository = trendSnapshotRepository;
        this.newUserCountRepository = newUserCountRepository;
        this.newPostCountRepository = newPostCountRepository;
        this.newSnapPostCountRepository = newSnapPostCountRepository;
        this.newReportCountRepository = newReportCountRepository;
    }

    @Scheduled(cron = "0 59 23 * * *")
    public void syncDailyTrends() {
        LocalDate today = LocalDate.now();

        if (trendSnapshotRepository.findByDate(today).isPresent()) return;

        int userCount = fetchNewUserCount(today);
        int postCount = fetchNewPostCount(today);
        int reportCount = fetchReportCount(today);

        TrendSnapshot snapshot = new TrendSnapshot();
        snapshot.setDate(today);
        snapshot.setNewUsers(userCount);
        snapshot.setNewPosts(postCount);
        snapshot.setTotalReports(reportCount);

        trendSnapshotRepository.save(snapshot);
    }

    private int fetchNewUserCount(LocalDate date) {
        return newUserCountRepository.countNewUsersByDate(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    private int fetchNewPostCount(LocalDate date) {
        int posts = newPostCountRepository.countNewPostsByDate(date);
        int snaps = newSnapPostCountRepository.countNewSnapPostsByDate(date);
        return posts + snaps;
    }

    private int fetchReportCount(LocalDate date) {
        return newReportCountRepository.countNewReportsByDate(date);
    }
}

