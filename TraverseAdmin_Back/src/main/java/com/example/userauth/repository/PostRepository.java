package com.example.userauth.repository;

import com.example.userauth.model.Post;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;
import java.util.stream.Collectors;  // 꼭 import 추가!

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class PostRepository {

    private final Firestore firestore;

    public PostRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Post> findPosts(int limit, String status,
                                String search, String user_id, Boolean hasReports, String sortBy, String sortOrder, String lastDocId)
            throws ExecutionException, InterruptedException {
        CollectionReference postsRef = firestore.collection("posts");
        Query query = postsRef;

        if (!status.equals("all")) {
            query = query.whereEqualTo("status", status);
        }

        if (user_id != null && !user_id.isEmpty()) {
            query = query.whereEqualTo("user_id", user_id);
        }

        if (Boolean.TRUE.equals(hasReports)) {
            query = query.whereGreaterThan("report_count", 0);
        }

        if (sortBy != null) {
            query = query.orderBy(sortBy, sortOrder.equalsIgnoreCase("asc") ? Query.Direction.ASCENDING : Query.Direction.DESCENDING);
        }


        // 페이지네이션을 위한 마지막 문서 기준 startAfter 적용
        if (lastDocId != null && !lastDocId.isEmpty()) {
            DocumentSnapshot lastDocSnapshot = firestore.collection("posts").document(lastDocId).get().get();
            if (lastDocSnapshot.exists()) {
                query = query.startAfter(lastDocSnapshot);
            }
        }

        // Firestore에서 직접 limit 적용
        query = query.limit(limit);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<Post> posts = new ArrayList<>();

        for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
            posts.add(doc.toObject(Post.class));
        }

        return posts;
    }

    public Post findPostById(String postId) throws ExecutionException, InterruptedException {
        DocumentReference postRef = firestore.collection("posts").document(postId);
        ApiFuture<DocumentSnapshot> future = postRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Post post = document.toObject(Post.class);

            // 댓글 및 신고 목록을 추가적으로 조회 (필요시 구현)
            post.setComments(findCommentsByPostId(postId));
            post.setReports(findReportsByPostId(postId));

            return post;
        } else {
            return null;  // 게시물이 없을 경우 null 반환
        }
    }

    private List<Post.Comment> findCommentsByPostId(String postId) throws ExecutionException, InterruptedException {
        CollectionReference commentsRef = firestore.collection("posts").document(postId).collection("comments");
        ApiFuture<QuerySnapshot> future = commentsRef.get();
        QuerySnapshot querySnapshot = future.get();

        return querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Post.Comment.class))
                .collect(Collectors.toList());
    }

    private List<Post.Report> findReportsByPostId(String postId) throws ExecutionException, InterruptedException {
        CollectionReference reportsRef = firestore.collection("posts").document(postId).collection("reports");
        ApiFuture<QuerySnapshot> future = reportsRef.get();
        QuerySnapshot querySnapshot = future.get();

        return querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Post.Report.class))
                .collect(Collectors.toList());
    }
}
