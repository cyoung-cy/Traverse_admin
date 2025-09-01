package com.example.userauth.controller;

import com.example.userauth.dto.response.ContentTrendResponseDTO;
import com.example.userauth.dto.response.MainDashboardResponseDTO;
import com.example.userauth.dto.response.TrendResponseDTO;
import com.example.userauth.dto.response.UserTrendResponseDTO;
import com.example.userauth.service.DashboardService;
import com.example.userauth.service.TrendDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class TrendDashboardController {

    private final TrendDashboardService trendDashboardService;
    private final DashboardService dashboardService;

    @GetMapping("/main")
    public MainDashboardResponseDTO getMainDashboard(@RequestParam String period) {
        return dashboardService.getMainDashboardData(period);
    }

    @GetMapping("/trends")
    public TrendResponseDTO getTrends(@RequestParam String start_date,
                                      @RequestParam String end_date,
                                      @RequestParam String interval) {
        return trendDashboardService.getTrends(start_date, end_date, interval);
    }

    @GetMapping("/user-trends")
    public UserTrendResponseDTO getUserTrends(@RequestParam String start_date,
                                              @RequestParam String end_date,
                                              @RequestParam String interval) {
        return trendDashboardService.getUserTrends(start_date, end_date, interval);
    }

    @GetMapping("/content-trends")
    public ContentTrendResponseDTO getContentTrends(@RequestParam String start_date,
                                                    @RequestParam String end_date,
                                                    @RequestParam String interval) {
        return trendDashboardService.getContentTrends(start_date, end_date, interval);
    }
}
