package com.example.userauth.dto.response;

import com.example.userauth.model.Post;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostResponseDTO {
    private String post_id;
    private String title;
    private String post_content;
    private String user_id;
    private String user_name;
    private String status;
    private String created_at;
    private String updated_at;
    private Long report_count;
    private int like_count;
    private int view_count;
    private int comment_count;
    private List<String> hash_tags;
    private List<String> post_images;
    private List<CommentResponseDto> comments;
    private List<ReportResponseDto> reports;

    public PostResponseDTO(Post post) {
        this.post_id = post.getpost_Id();
        this.title = post.getTitle();
        this.post_content = post.getPost_content();
        this.user_id = post.getUser_id();
        this.user_name = post.getUser_name();
        this.status = post.getStatus();

        this.created_at = post.getCreated_at();
        this.updated_at = post.getUpdated_at();

        this.report_count = post.getReport_count();
        this.like_count = post.getLike_count();
        this.view_count = post.getView_count();
        this.comment_count = post.getComments() != null ? post.getComments().size() : 0;
        this.hash_tags = post.getHash_tags();
        this.post_images = post.getPost_images();

        this.comments = post.getComments() != null
                ? post.getComments().stream().map(CommentResponseDto::new).collect(Collectors.toList())
                : null;

        this.reports = post.getReports() != null
                ? post.getReports().stream().map(ReportResponseDto::new).collect(Collectors.toList())
                : null;
    }

    @Getter
    public static class CommentResponseDto {
        private String comment_id;
        private String user_id;
        private String user_name;
        private String content;
        private String created_at;
        private int report_count;

        public CommentResponseDto(Post.Comment comment) {
            this.comment_id = comment.getComment_id();
            this.user_id = comment.getUser_id();
            this.user_name = comment.getUser_name();
            this.content = comment.getContent();
            this.created_at = comment.getCreated_at();
            this.report_count = comment.getReport_count();
        }
    }

    @Getter
    public static class ReportResponseDto {
        private String report_id;
        private String reason;
        private String status;

        public ReportResponseDto(Post.Report report) {
            this.report_id = report.getReport_id();
            this.reason = report.getReason();
            this.status = report.getStatus();
        }
    }
}
