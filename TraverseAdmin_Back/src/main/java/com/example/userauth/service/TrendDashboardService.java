package com.example.userauth.service;

import com.example.userauth.dto.response.ContentTrendResponseDTO;
import com.example.userauth.dto.response.TrendResponseDTO;
import com.example.userauth.dto.response.UserTrendResponseDTO;

public interface TrendDashboardService {
    TrendResponseDTO getTrends(String startDate, String endDate, String interval);
    UserTrendResponseDTO getUserTrends(String startDate, String endDate, String interval);
    ContentTrendResponseDTO getContentTrends(String startDate, String endDate, String interval);
}
