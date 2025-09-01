package com.example.userauth.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class TrendResponseDTO {
    private boolean success;
    private TrendData data;

    @Data
    public static class TrendData {
        private List<TrendItem> trends;

        public List<TrendItem> getTrends() {
            return trends;
        }

        public void setTrends(List<TrendItem> trends) {
            this.trends = trends;
        }
    }

    @Data
    public static class TrendItem {
        private String date;
        private int new_users;
        private int new_posts;
        private int total_reports;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public int getNew_users() {
            return new_users;
        }

        public void setNew_users(int new_users) {
            this.new_users = new_users;
        }

        public int getNew_posts() {
            return new_posts;
        }

        public void setNew_posts(int new_posts) {
            this.new_posts = new_posts;
        }

        public int getTotal_reports() {
            return total_reports;
        }

        public void setTotal_reports(int total_reports) {
            this.total_reports = total_reports;
        }
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public TrendData getData() {
        return data;
    }

    public void setData(TrendData data) {
        this.data = data;
    }
}
