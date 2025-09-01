package com.example.userauth.dto.response;

import java.util.List;

public class DashboardMainResponse {
    private boolean success;
    private Data data;

    public static class Data {
        private UserStats user_stats;
        private ContentStats content_stats;
        private ReportStats report_stats;
        private MatchingStats matching_stats;
        private List<String> recent_activity; // 현재 비어있음, 추후 구현 시 변경 가능

        public UserStats getUser_stats() { return user_stats; }
        public void setUser_stats(UserStats user_stats) { this.user_stats = user_stats; }

        public ContentStats getContent_stats() { return content_stats; }
        public void setContent_stats(ContentStats content_stats) { this.content_stats = content_stats; }

        public ReportStats getReport_stats() { return report_stats; }
        public void setReport_stats(ReportStats report_stats) { this.report_stats = report_stats; }

        public MatchingStats getMatching_stats() { return matching_stats; }
        public void setMatching_stats(MatchingStats matching_stats) { this.matching_stats = matching_stats; }

        public List<String> getRecent_activity() { return recent_activity; }
        public void setRecent_activity(List<String> recent_activity) { this.recent_activity = recent_activity; }
    }

    public static class UserStats {
        private int total;
        private int newUsers;
        private int active;
        private double growth;

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }

        public int getNewUsers() { return newUsers; }
        public void setNewUsers(int newUsers) { this.newUsers = newUsers; }

        public int getActive() { return active; }
        public void setActive(int active) { this.active = active; }

        public double getGrowth() { return growth; }
        public void setGrowth(double growth) { this.growth = growth; }
    }

    public static class ContentStats {
        private int total_posts;
        private int new_posts;
        private long pending_review;
        private int comment_count;

        public int getTotal_posts() { return total_posts; }
        public void setTotal_posts(int total_posts) { this.total_posts = total_posts; }

        public int getNew_posts() { return new_posts; }
        public void setNew_posts(int new_posts) { this.new_posts = new_posts; }

        public long getPending_review() { return pending_review; }
        public void setPending_review(long pending_review) { this.pending_review = pending_review; }

        public int getComment_count() { return comment_count; }
        public void setComment_count(int comment_count) { this.comment_count = comment_count; }
    }

    public static class ReportStats {
        private int total;
        private long pending;
        private long resolved;
        private List<ByCategory> by_category;

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }

        public long getPending() { return pending; }
        public void setPending(long pending) { this.pending = pending; }

        public long getResolved() { return resolved; }
        public void setResolved(long resolved) { this.resolved = resolved; }

        public List<ByCategory> getBy_category() { return by_category; }
        public void setBy_category(List<ByCategory> by_category) { this.by_category = by_category; }
    }

    public static class ByCategory {
        private String category;
        private long count;

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class MatchingStats {
        private int active_chats;
        private long total_matches;
        private double success_rate;

        public int getActive_chats() { return active_chats; }
        public void setActive_chats(int active_chats) { this.active_chats = active_chats; }

        public long getTotal_matches() { return total_matches; }
        public void setTotal_matches(long total_matches) { this.total_matches = total_matches; }

        public double getSuccess_rate() { return success_rate; }
        public void setSuccess_rate(double success_rate) { this.success_rate = success_rate; }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }
}
