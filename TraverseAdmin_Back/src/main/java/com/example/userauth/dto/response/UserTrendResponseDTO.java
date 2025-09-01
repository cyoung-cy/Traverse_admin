package com.example.userauth.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
public class UserTrendResponseDTO {
    private boolean success;
    private UserTrendData data;

    @Data
    public static class UserTrendData {
        private List<TrendItem> signup_trend;
        private List<TrendItem> active_trend;
        private List<RetentionItem> retention_trend;
        private Demographics user_demographics;
    }

    @Data
    public static class TrendItem {
        private String date;
        private int count;

        public TrendItem(String string, int newUsers) {
            this.date = string;
            this.count = newUsers;
        }
    }

    @Data
    public static class RetentionItem {
        private String date;
        private double rate;

        public RetentionItem(String string, double retentionRate) {
            this.date = string;
            this.rate = retentionRate;
        }
    }

    @Data
    public static class Demographics {
        private List<AgeItem> by_age;
        private List<GenderItem> by_gender;
        private List<LocationItem> by_location;
    }

    @Data
    public static class AgeItem {
        private String range;
        private int count;
        private double percentage;

        public AgeItem(String range, int count, double percentage) {
            this.range = range;
            this.count = count;
            this.percentage = percentage;
        }
    }

    @Data
    public static class GenderItem {
        private String gender;
        private int count;
        private double percentage;

        public GenderItem(String gender, int count, double percentage) {
            this.gender = gender;
            this.count = count;
            this.percentage = percentage;
        }
    }

    @Data
    public static class LocationItem {
        private String location;
        private int count;
        private double percentage;

        public LocationItem(String location, int count, double percentage) {
            this.location = location;
            this.count = count;
            this.percentage = percentage;
        }
    }

    @Data
    @AllArgsConstructor
    public static class AgeStat {
        private String range;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class GenderStat {
        private String gender;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class LocationStat {
        private String location;
        private long count;
    }

}
