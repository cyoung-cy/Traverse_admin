package com.example.userauth.dto.response;

import java.util.List;

public class NotificationHistoryResponseDTO {
    private boolean success;
    private HistoryData data;

    public static class HistoryData {
        private List<NotificationHistoryItemDTO> notifications;
        private int totalCount;
        private int currentPage;
        private int totalPages;

        public List<NotificationHistoryItemDTO> getNotifications() {
            return notifications;
        }

        public void setNotifications(List<NotificationHistoryItemDTO> notifications) {
            this.notifications = notifications;
        }

        public int getTotalCount() {
            return totalCount;
        }

        public void setTotalCount(int totalCount) {
            this.totalCount = totalCount;
        }

        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public HistoryData getData() { return data; }
    public void setData(HistoryData data) { this.data = data; }
}
