import { useEffect, useState } from "react";
import { postAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const PendingReviewPostsTable = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const res = await postAPI.getPendingReviews({ page: 1, limit: 20 });
      if (res.success) setPosts(res.data.posts);
      else setError("데이터를 불러오지 못했습니다.");
    } catch (e) {
      setError("에러 발생: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (postId, decision, e) => {
    e.stopPropagation();
    const reason = window.prompt("사유를 입력하세요");
    if (!reason) return;
    try {
      await postAPI.reviewPost(postId, { decision, reason, notify_user: true });
      setPosts(posts.filter((p) => p.post_id !== postId));
    } catch (e) {
      alert("처리 실패: " + e.message);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-400">로딩 중...</div>;
  if (error) return <div className="p-6 text-center text-red-400">{error}</div>;

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
      <h2 className="mb-4 text-xl font-semibold text-gray-100">
        검토 대기 게시물
      </h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-400">제목</th>
            <th className="px-4 py-2 text-left text-gray-400">작성자</th>
            <th className="px-4 py-2 text-left text-gray-400">신고수</th>
            <th className="px-4 py-2 text-left text-gray-400">검토</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-400">
                검토 대기 게시물이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr
                key={post.post_id}
                className="cursor-pointer hover:bg-gray-700/40"
                onClick={() => navigate(`/posts/${post.post_id}`)}
              >
                <td className="px-4 py-2 text-gray-200">{post.title}</td>
                <td className="px-4 py-2 text-gray-200">{post.user_name}</td>
                <td className="px-4 py-2 text-gray-200">{post.severity}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
                    onClick={(e) => handleReview(post.post_id, "approve", e)}
                  >
                    승인
                  </button>
                  <button
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    onClick={(e) => handleReview(post.post_id, "reject", e)}
                  >
                    거부
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingReviewPostsTable;
