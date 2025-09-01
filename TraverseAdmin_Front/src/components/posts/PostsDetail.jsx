import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  X,
  ThumbsUp,
  Eye,
  Tag,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { postAPI } from "../../utils/api";
import PostStatusModal from "./PostStatusModal";
import Header from "../common/Header";
import ImageModal from "../common/ImageModal";

const PostsDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageUrls, setCurrentImageUrls] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postAPI.getPostDetail(postId);
        if (response && response.data) {
          console.log("게시물 정보:", response.data);
          setPost(response.data);
          setError(null);
        } else {
          console.error("API 응답이 올바른 형식이 아닙니다:", response);
          setPost(null);
          setError("게시물 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
        setPost(null);
        setError("게시물 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"; // 대기 중 노란색
      case "resolved":
        return "bg-green-500"; // 해결됨 초록색
      case "active":
        return "bg-blue-500"; // 필요하면 추가
      case "deleted":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "resolved":
        return "해결됨";
      case "active":
        return "활성";
      case "deleted":
        return "삭제됨";
      default:
        return "알 수 없음";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertTriangle size={16} className="mr-1" />; // 경고 아이콘
      case "resolved":
        return <CheckCircle size={16} className="mr-1" />; // 체크 아이콘
      case "active":
        return <Eye size={16} className="mr-1" />;
      case "deleted":
        return <Trash2 size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (statusData) => {
    try {
      await postAPI.updatePostStatus(postId, statusData);

      // 게시물 정보 다시 가져오기
      const response = await postAPI.getPostDetail(postId);
      if (response && response.data) {
        setPost(response.data);
        setError(null);
      }

      setIsStatusModalOpen(false);
    } catch (error) {
      setError("게시물 상태 변경 중 오류가 발생했습니다.");
      console.error("Error updating post status:", error);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setCurrentImageUrls(post.post_images || []);
    setIsImageModalOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">로딩 중...</div>;
  }

  if (!post) {
    return (
        <div className="p-6 text-center text-gray-400">
          게시물 정보를 찾을 수 없습니다.
        </div>
    );
  }

  return (
      <div className="overflow-auto relative z-10 flex-1">
        <Header title="게시물 상세 정보" />
        <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft size={16} />
          <span>뒤로가기</span>
        </button>

        <div className="grid grid-cols-2 gap-6 px-4 py-6 mx-auto max-w-7xl lg:px-8">
          <div>
            <div className="flex flex-col gap-3 p-4 text-sm bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <h2 className="mb-2 text-base font-semibold text-gray-100">
                기본 정보
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <h3 className="mb-0.5 text-xs font-medium text-gray-400">
                    게시물 ID
                  </h3>
                  <p className="text-gray-200 break-all">{post.post_id}</p>
                </div>
                <div>
                  <h3 className="mb-0.5 text-xs font-medium text-gray-400">
                    제목
                  </h3>
                  <p className="text-gray-200 break-all">{post.title}</p>
                </div>
                <div>
                  <h3 className="mb-0.5 text-xs font-medium text-gray-400">
                    사용자 ID
                  </h3>
                  <p className="text-gray-200 break-all">{post.user_id}</p>
                </div>
                <div>
                  <h3 className="mb-0.5 text-xs font-medium text-gray-400">
                    상태
                  </h3>
                  <div className="flex gap-1 items-center">
                  <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${getStatusColor(
                          post.status
                      )} text-white flex items-center`}
                  >
                    {getStatusIcon(post.status)}
                    {getStatusText(post.status)}
                  </span>
                    <button
                        className="ml-1 text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => setIsStatusModalOpen(true)}
                    >
                      상태 변경
                    </button>
                  </div>
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <ThumbsUp className="text-blue-400" size={16} />
                  <span className="text-xs text-gray-400">좋아요</span>
                  <span className="ml-1 text-sm font-semibold text-gray-200">
                  {post.like_count}
                </span>
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <Eye className="text-green-400" size={16} />
                  <span className="text-xs text-gray-400">조회수</span>
                  <span className="ml-1 text-sm font-semibold text-gray-200">
                  {post.view_count}
                </span>
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <Calendar className="text-purple-400" size={16} />
                  <span className="text-xs text-gray-400">작성일</span>
                  <span className="ml-1 text-xs font-semibold text-gray-200">
                  {formatDate(post.created_at)}
                </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 mt-4 text-sm bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <h2 className="mb-2 text-base font-semibold text-gray-100">
                게시물 내용
              </h2>
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {post.post_content}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.post_images && post.post_images.length > 0 ? (
                      post.post_images.map((url, index) => (
                          <img
                              key={index}
                              src={url}
                              alt={`게시물 이미지 ${index + 1}`}
                              className="object-cover w-20 h-20 rounded border border-gray-700 cursor-pointer hover:scale-105"
                              onClick={() => handleImageClick(index)}
                          />
                      ))
                  ) : (
                      <span className="text-xs text-gray-400">
                    등록된 사진이 없습니다
                  </span>
                  )}
                </div>
                <div className="mt-2">
                  {post.hash_tags && post.hash_tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {post.hash_tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-1.5 py-0.5 text-[10px] text-white bg-blue-600 rounded-full"
                            >
                        #{tag}
                      </span>
                        ))}
                      </div>
                  ) : (
                      <span className="text-xs text-gray-400">해시태그 없음</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="p-4 text-xs bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <h2 className="mb-2 text-sm font-semibold text-gray-100">
                댓글 ({post.comment_count})
              </h2>
              <div className="overflow-y-auto space-y-2 max-h-80">
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                        <div
                            key={comment.comment_id}
                            className="p-2 bg-gray-700 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex gap-1 items-center">
                        <span className="font-medium text-gray-200">
                          {comment.user_name}
                        </span>
                              <span className="text-[10px] text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                            </div>
                            {comment.report_count > 0 && (
                                <span className="px-1 py-0.5 text-[10px] text-white bg-red-500 rounded-full">
                          신고 {comment.report_count}
                        </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-300">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-gray-400">댓글이 없습니다</span>
                )}
              </div>
            </div>
            <div className="p-4 mt-4 text-xs bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <h2 className="flex items-center mb-2 text-sm font-semibold text-gray-100">
                <AlertTriangle className="mr-1 text-red-500" size={14} />
                신고 내역 ({post.reports ? post.reports.length : 0})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-2 py-1 text-gray-400">신고 ID</th>
                    <th className="px-2 py-1 text-gray-400">신고 사유</th>
                    <th className="px-2 py-1 text-gray-400">상태</th>
                  </tr>
                  </thead>
                  <tbody>
                  {post.reports && post.reports.length > 0 ? (
                      post.reports.map((report, index) => (
                          <tr
                              key={report.report_id}
                              className="border-b border-gray-700"
                          >
                            <td className="px-2 py-1 text-gray-300">
                              {report.report_id}
                            </td>
                            <td className="px-2 py-1 text-gray-300">
                              {report.reason}
                            </td>
                            <td className="px-2 py-1">
                          <span
                              className={`px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor(
                                  report.status
                              )} text-white`}
                          >
                            {getStatusText(report.status)}
                          </span>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td
                            colSpan={3}
                            className="px-2 py-4 text-center text-gray-400"
                        >
                          신고 내역이 없습니다
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 모달 */}
        {isImageModalOpen && (
            <ImageModal
                isOpen={isImageModalOpen}
                imageUrls={currentImageUrls}
                initialIndex={selectedImageIndex}
                onClose={() => setIsImageModalOpen(false)}
            />
        )}

        {/* 에러 메시지 */}
        {error && (
            <div className="fixed right-4 bottom-4 p-4 text-white bg-red-500 rounded-lg">
              {error}
            </div>
        )}

        {/* 상태 변경 모달 */}
        <PostStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            onSubmit={handleStatusChange}
            currentStatus={post.status}
        />
      </div>
  );
};

export default PostsDetail;
