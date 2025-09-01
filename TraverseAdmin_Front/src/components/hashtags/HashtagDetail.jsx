import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  BarChart2,
  Edit,
  AlertCircle,
} from "lucide-react";
import { hashtagAPI } from "../../utils/api";

const HashtagDetail = () => {
  const { hashtagId } = useParams();
  const navigate = useNavigate();
  const [hashtag, setHashtag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchHashtagDetail = async () => {
      try {
        const response = await hashtagAPI.getHashtagDetail(hashtagId);
        if (response.success) {
          setHashtag(response.data);
          console.log("해시태그 상세 정보:", response.data);
        } else {
          console.error("해시태그 정보 가져오기 실패:", response.error);
        }
      } catch (error) {
        console.error("해시태그 정보 조회 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHashtagDetail();
  }, [hashtagId]);

  const handleStatusChange = async (statusData) => {
    setStatusLoading(true);
    try {
      console.log("상태 변경 요청 데이터:", statusData);
      const response = await hashtagAPI.updateHashtagStatus(
        hashtagId,
        statusData
      );
      console.log("상태 변경 응답:", response);

      if (response.success) {
        setStatusMessage({ type: "success", text: response.message });
        // 상태 변경 후 해시태그 정보 다시 불러오기
        const updatedHashtag = await hashtagAPI.getHashtagDetail(hashtagId);
        if (updatedHashtag.success) {
          setHashtag(updatedHashtag.data);
          console.log("업데이트된 해시태그 정보:", updatedHashtag.data);
        }
      } else {
        setStatusMessage({
          type: "error",
          text: response.error?.message || "상태 변경 실패",
        });
      }
    } catch (error) {
      console.error("상태 변경 중 오류:", error);
      setStatusMessage({
        type: "error",
        text: "상태 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setStatusLoading(false);
      setTimeout(() => setStatusMessage(null), 3000); // 3초 후 메시지 숨기기
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-10 h-10 rounded-full border-4 animate-spin border-t-blue-500 border-b-blue-700"></div>
      </div>
    );

  if (!hashtag)
    return <div className="p-6 text-white">해시태그를 찾을 수 없습니다</div>;

  // 트렌드 아이콘
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "hot":
        return <TrendingUp className="text-red-500" />;
      case "new":
        return <BarChart2 className="text-blue-500" />;
      default:
        return <BarChart2 className="text-gray-500" />;
    }
  };

  // 상태 배지
  const getStatusBadge = (status) => {
    let statusValue = status || "active";
    let statusLabel =
      statusValue === "active"
        ? "활성"
        : statusValue === "blocked"
        ? "차단됨"
        : statusValue === "featured"
        ? "주목"
        : statusValue;
    let badgeClass =
      statusValue === "active"
        ? "bg-green-700 text-green-100"
        : statusValue === "blocked"
        ? "bg-red-700 text-red-100"
        : statusValue === "featured"
        ? "bg-yellow-700 text-yellow-100"
        : "bg-gray-700 text-gray-200";
    return (
      <span className={`px-2 py-1 text-sm font-semibold rounded ${badgeClass}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-gray-300 hover:text-white"
      >
        <ArrowLeft className="mr-2" size={20} />
        뒤로 가기
      </button>

      {statusMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            statusMessage.type === "success" ? "bg-green-600" : "bg-red-600"
          } bg-opacity-50`}
        >
          <p className="text-white">{statusMessage.text}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="mr-3 text-3xl font-bold text-white">
            #{hashtag.name}
          </h1>
          {getStatusBadge(hashtag.status)}
        </div>
        <button
          onClick={() => setStatusModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
        >
          <Edit size={16} className="mr-2" />
          상태 변경
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              title="사용 횟수"
              value={hashtag.usage_count.toLocaleString()}
            />
            <InfoCard
              title="트렌드"
              icon={getTrendIcon(hashtag.trend)}
              value={
                hashtag.trend === "hot"
                  ? "인기"
                  : hashtag.trend === "new"
                  ? "신규"
                  : "안정"
              }
            />
            <InfoCard
              title="생성일"
              value={new Date(hashtag.created_at).toLocaleDateString()}
            />
            <InfoCard
              title="마지막 사용"
              value={new Date(hashtag.last_used_at).toLocaleDateString()}
            />
          </div>

          {/* 트렌드 차트 (실제로는 여기에 차트 컴포넌트가 들어갈 수 있음) */}
          <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="mb-4 font-semibold text-white">사용 추이</h3>
            <div className="p-2 h-64 bg-gray-800 bg-opacity-50 rounded">
              {/* 실제 차트 대신 표시할 임시 내용 */}
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-400">지난 30일간 데이터</p>
                <div className="flex items-end space-x-1 w-full h-40">
                  {hashtag.trend_data &&
                    hashtag.trend_data.slice(-10).map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-blue-500"
                          style={{
                            height: `${Math.min(
                              100,
                              (data.count /
                                Math.max(
                                  ...hashtag.trend_data.map((d) => d.count)
                                )) *
                                100
                            )}%`,
                            minHeight: "10%",
                          }}
                        ></div>
                        <span className="mt-1 text-xs text-gray-400">
                          {new Date(data.date).getDate()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 관련 해시태그 */}
          <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="mb-3 font-semibold text-white">관련 해시태그</h3>
            <div className="space-y-2">
              {hashtag.related_hashtags &&
              hashtag.related_hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hashtag.related_hashtags.map((relatedTag) => (
                    <div
                      key={relatedTag.id}
                      onClick={() => navigate(`/hashtags/${relatedTag.id}`)}
                      className="flex items-center px-3 py-2 text-sm bg-gray-600 bg-opacity-50 rounded-lg cursor-pointer hover:bg-opacity-70"
                    >
                      <span className="font-medium">#{relatedTag.name}</span>
                      <span className="ml-2 text-xs text-gray-300">
                        {relatedTag.usage_count.toLocaleString()}회
                      </span>
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-500 bg-opacity-30 rounded-full">
                        {(relatedTag.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">관련 해시태그가 없습니다</p>
              )}
            </div>
          </div>

          {/* 인기 게시물 */}
          <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="mb-3 font-semibold text-white">인기 게시물</h3>
            <div className="space-y-3">
              {hashtag.top_posts && hashtag.top_posts.length > 0 ? (
                hashtag.top_posts.map((post) => (
                  <div
                    key={post.post_id}
                    className="p-3 bg-gray-800 bg-opacity-50 rounded-lg"
                  >
                    <h4 className="font-medium text-white">{post.title}</h4>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <span className="mr-4">
                        좋아요: {post.like_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">인기 게시물이 없습니다</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {statusModalOpen && (
        <StatusChangeModal
          currentStatus={hashtag.status}
          onClose={() => setStatusModalOpen(false)}
          onSubmit={handleStatusChange}
          loading={statusLoading}
        />
      )}
    </motion.div>
  );
};

const InfoCard = ({ title, value, icon }) => (
  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
    <h4 className="text-sm text-gray-400">{title}</h4>
    <div className="flex items-center mt-1">
      {icon && <div className="mr-2">{icon}</div>}
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  </div>
);

const StatusChangeModal = ({ currentStatus, onClose, onSubmit, loading }) => {
  const [status, setStatus] = useState(currentStatus || "active");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      status,
      reason,
    });
    onClose();
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg">
        <h3 className="mb-4 text-xl font-semibold text-white">
          해시태그 상태 변경
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              상태
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
              required
            >
              <option value="active">활성화</option>
              <option value="blocked">차단</option>
              <option value="featured">주목</option>
            </select>
          </div>

          {status === "blocked" && (
            <div className="flex items-start p-3 mb-4 bg-red-500 bg-opacity-20 rounded-lg border border-red-500">
              <AlertCircle
                className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                size={16}
              />
              <p className="text-sm text-red-100">
                차단된 해시태그는 사용자 검색결과에 표시되지 않으며, 새로운
                게시물에 이 해시태그를 추가할 수 없습니다.
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              사유
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
              rows="3"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "변경"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HashtagDetail;
