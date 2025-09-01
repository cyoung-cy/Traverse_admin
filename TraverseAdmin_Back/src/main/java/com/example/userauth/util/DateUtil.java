package com.example.userauth.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Component
public class DateUtil {

    // ✅ 필요한 메서드 추가
    public static LocalDateTime[] getDateRange(String period) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        switch (period.toLowerCase()) {
            case "daily":
                start = end.minusDays(1);
                break;
            case "weekly":
                start = end.minusWeeks(1);
                break;
            case "monthly":
                start = end.minusMonths(1);
                break;
            default:
                start = end.minusDays(1);
        }

        return new LocalDateTime[]{start, end};
    }


    public List<LocalDate> generateDateRange(LocalDate start, LocalDate end, String interval) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate current = start;

        while (!current.isAfter(end)) {
            dates.add(current);
            switch (interval.toLowerCase()) {
                case "daily": current = current.plusDays(1); break;
                case "weekly": current = current.plusWeeks(1); break;
                case "monthly": current = current.plusMonths(1); break;
                default: current = current.plusDays(1); break;
            }
        }
        return dates;
    }
}
