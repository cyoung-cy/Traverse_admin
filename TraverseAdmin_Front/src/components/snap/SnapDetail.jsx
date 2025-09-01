import { useEffect, useState } from "react";
import { snapAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ThumbsUp, Eye, MessageCircle } from "lucide-react";
import ImageModal from "../common/ImageModal";

const STATUS_OPTIONS = [
  { value: "active", label: "활성" },
  { value: "pending", label: "대기" },
  { value: "hidden", label: "숨김" },
  { value: "deleted", label: "삭제됨" },
];

const SnapDetail = ({ snapId }) => {
  const [snap, setSnap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [reason, setReason] = useState("");
  const [changing, setChanging] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageUrls, setCurrentImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!snapId) return;
    setLoading(true);
    setError(null);
    snapAPI
        .getSnapDetail(snapId)
        .then((res) => {
          setSnap(res.data.data);
        })
        .catch(() => {
          setError("스냅 정보를 불러오지 못했습니다.");
        })
        .finally(() => setLoading(false));
  }, [snapId]);

  // 모달에서 상태 변경 핸들러
  const handleStatusChangeModal = () => {
    if (!nextStatus || nextStatus === snap.status) {
      alert("변경할 상태를 선택하세요.");
      return;
    }
    if (!reason.trim()) {
      alert("변경 사유를 입력하세요.");
      return;
    }
    setChanging(true);
    snapAPI
        .updateSnapStatus(snapId, { status: nextStatus, reason })
        .then(() => snapAPI.getSnapDetail(snapId))
        .then((res) => {
          setSnap(res.data);
          alert("상태가 변경되었습니다. 목록/통계도 새로고침 해주세요.");
          setModalOpen(false);
          setReason("");
        })
        .catch(() => {
          alert("상태 변경에 실패했습니다.");
        })
        .finally(() => setChanging(false));
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setCurrentImageUrls(snap.snap_images || []);
    setImageModalOpen(true);
  };

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!snap) return <div className="p-8">스냅 정보가 없습니다.</div>;

  return (
      <div className="p-8 mx-auto max-w-4xl bg-gray-800 rounded-lg shadow">
        {/* 기본정보 */}
        <div className="pb-4 mb-6 border-b border-gray-700">
          <h2 className="mb-2 text-2xl font-bold text-gray-100">{snap.title}</h2>
          <div className="mb-1 text-gray-400">
            게시물 ID: <span className="text-gray-200">{snap.id}</span>
          </div>
          <div className="mb-1 text-gray-400">
            유저 ID: <span className="text-gray-200">{snap.user_id}</span>
          </div>
          <div className="mb-1 text-gray-400">
            생성일:{" "}
            <span className="text-gray-200">{snap.created_at?.slice(0, 10)}</span>
          </div>
        </div>

        {/* 내용 */}
        <div className="mb-6">
          {/* 캡션 */}
          {snap.captions && snap.captions.length > 0 && (
              <div className="mb-4">
                <div className="mb-1 text-lg font-semibold text-gray-300">본문</div>
                <div className="p-3 text-gray-200 whitespace-pre-line bg-gray-700 rounded">
                  {snap.captions.map((cap, idx) => (
                      <p key={idx} className="mb-1 last:mb-0">
                        {cap}
                      </p>
                  ))}
                  {/* 이미지 */}
                  {snap.snap_images && snap.snap_images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {snap.snap_images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`snap-img-${idx}`}
                                className="object-cover w-40 h-28 rounded border border-gray-600 shadow cursor-pointer hover:opacity-90"
                                onClick={() => handleImageClick(idx)}
                            />
                        ))}
                      </div>
                  )}
                </div>
              </div>
          )}
        </div>

        {/* 기타 정보 (상태, 해시태그, 좋아요 등) */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex gap-2 items-center">
            <span>상태:</span>
            <span
                className={`px-2 py-1 rounded text-sm font-semibold 
            ${snap.status === "active" ? "bg-green-700 text-green-100" : ""}
            ${snap.status === "pending" ? "bg-yellow-700 text-yellow-100" : ""}
            ${snap.status === "hidden" ? "bg-gray-600 text-gray-200" : ""}
            ${snap.status === "deleted" ? "bg-red-700 text-red-100" : ""}`}
            >
            {STATUS_OPTIONS.find((opt) => opt.value === snap.status)?.label ||
                snap.status}
          </span>
            <button
                className="px-3 py-1 ml-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => {
                  setNextStatus("");
                  setReason("");
                  setModalOpen(true);
                }}
            >
              상태 변경
            </button>
          </div>
          {/* 해시태그 */}
          {snap.hash_tags && snap.hash_tags.length > 0 && (
              <div>
                {snap.hash_tags.map((tag, idx) => (
                    <span key={idx} className="mr-2 text-blue-400">
                {tag}
              </span>
                ))}
              </div>
          )}
          {/* 좋아요/조회수/댓글수 */}
          <div className="flex gap-4 text-gray-400">
          <span className="flex gap-1 items-center">
            <ThumbsUp className="w-4 h-4" />
            {snap.like_count ?? snap.like_Count}
          </span>
            <span className="flex gap-1 items-center">
            <Eye className="w-4 h-4" />
              {snap.view_count ?? snap.view_Count}
          </span>
            <span className="flex gap-1 items-center">
            <MessageCircle className="w-4 h-4" />
              {snap.comment_count}
          </span>
          </div>
        </div>

        {/* 이미지 모달 */}
        {imageModalOpen && (
            <ImageModal
                isOpen={imageModalOpen}
                imageUrls={currentImageUrls}
                initialIndex={selectedImageIndex}
                onClose={() => setImageModalOpen(false)}
            />
        )}

        {/* 상태 변경 모달 */}
        {modalOpen && (
            <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-40">
              <div className="p-6 w-full max-w-xl bg-gray-900 rounded-lg shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-gray-100">상태 변경</h3>
                <div className="mb-3">
                  <label className="block mb-1 text-gray-300">새로운 상태</label>
                  <select
                      className="px-2 py-1 w-full text-gray-100 bg-gray-700 rounded border border-gray-600"
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value)}
                  >
                    <option value="">상태 선택</option>
                    {STATUS_OPTIONS.filter((opt) => opt.value !== snap.status).map(
                        (opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                        )
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 text-gray-300">변경 사유</label>
                  <textarea
                      className="w-full px-2 py-1 rounded bg-gray-700 text-gray-100 border border-gray-600 min-h-[180px]"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="변경 사유를 입력하세요"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                      className="px-3 py-1 text-gray-200 bg-gray-600 rounded hover:bg-gray-700"
                      onClick={() => setModalOpen(false)}
                      disabled={changing}
                  >
                    취소
                  </button>
                  <button
                      className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                      onClick={handleStatusChangeModal}
                      disabled={changing}
                  >
                    {changing ? "변경 중..." : "확인"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default SnapDetail;
