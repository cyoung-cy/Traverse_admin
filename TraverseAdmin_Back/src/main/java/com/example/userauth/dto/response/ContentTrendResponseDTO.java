package com.example.userauth.dto.response;
import lombok.Data;
import java.util.List;

@Data
public class ContentTrendResponseDTO {
    private boolean success = true;
    private ContentTrendDataDTO data;

    @Data
    public class ContentTrendDataDTO {
        private List<TrendCountDTO> post_trend;
        private List<TrendCountDTO> comment_trend;
        private List<EngagementTrendDTO> engagement_trend;
        private TopContentDTO top_content;
    }

    @Data
    public class TrendCountDTO {
        private String date;
        private int count;
    }

    @Data
    public class EngagementTrendDTO {
        private String date;
        private int likes;
        private int comments;
        private int shares;
    }

    @Data
    public class TopContentDTO {
        private List<PostSummaryDTO> posts;
        private List<HashtagDTO> hashtags;
    }

    @Data
    public class PostSummaryDTO {
        private String post_id;
        private String title;
        private int engagement;
    }

    @Data
    public class HashtagDTO {
        private String id;
        private String name;
        private int usage_count;
    }
}
