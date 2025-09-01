import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { userAPI } from "../../utils/api";
import Header from "../common/Header";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await userAPI.getUserDetail(userId);
        setUser(response.data);
        console.log("User Details:", response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [userId]);

  const handleStatusChange = async (statusData) => {
    setStatusLoading(true);
    try {
      const response = await userAPI.updateUserStatus(userId, statusData);
      if (response.success) {
        setStatusMessage({ type: "success", text: response.message });
        const updatedUser = await userAPI.getUserDetail(userId);
        setUser(updatedUser.data);
      } else {
        setStatusMessage({ type: "error", text: response.error.message });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "상태 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setStatusLoading(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (!user) return <div className="text-white">User not found</div>;

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="유저 상세 정보" />
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
      >
        <ArrowLeft size={32} className="mr-3 text-blue-400" />
        <span className="text-base font-semibold">뒤로가기</span>
      </button>
      <motion.div
        className="p-6 mx-auto max-w-7xl bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {statusMessage && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              statusMessage.type === "success" ? "bg-green-600" : "bg-red-600"
            } bg-opacity-50`}
          >
            <p className="text-white">{statusMessage.text}</p>
          </div>
        )}

        <div className="flex items-center mb-4 space-x-4">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.user_name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="flex justify-center items-center w-10 h-10 font-semibold text-white bg-gradient-to-r from-purple-400 to-blue-500 rounded-full">
              {user.user_name && user.user_name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user.user_name}</h2>
            <p className="text-gray-400">{user.user_id}</p>
          </div>
          <button
            onClick={() => setStatusModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          >
            상태 변경
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard title="게시물" value={user.post_count || 0} />
              <InfoCard title="신고" value={user.report_count || 0} />
              <InfoCard title="팔로워" value={user.follower_count || 0} />
              <InfoCard title="팔로잉" value={user.following_count || 0} />

              <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <h3 className="mb-2 font-semibold text-white">가입일</h3>
                <p className="text-gray-300">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <DetailSection title="개인 정보">
                <DetailItem label="성별" value={user.gender || "정보 없음"} />
                <DetailItem
                  label="생년월일"
                  value={
                    user.birthdate
                      ? new Date(user.birthdate).toLocaleDateString()
                      : "정보 없음"
                  }
                />
              </DetailSection>
            </div>

            <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
              <h3 className="mb-2 font-semibold text-white">소개</h3>
              <p className="text-gray-300">{user.bio || "소개 없음"}</p>
            </div>
            {/* <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
              <h3 className="mb-2 font-semibold text-white">Last Login</h3>
              <p className="text-gray-300">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleDateString()
                  : "정보 없음"}
              </p>
              </div> */}
          </div>

          <div className="space-y-6">
            <DetailSection title="연락처 정보">
              <DetailItem label="이메일" value={user.email || "정보 없음"} />
              <DetailItem
                label="전화번호"
                value={user.phone_number || "정보 없음"}
              />
              {/* <DetailItem
                label="Location"
                value={user.location || "정보 없음"}
              /> */}
            </DetailSection>

            {/* <DetailItem
                label="Country"
                value={user.country_code || "정보 없음"}
              /> */}

            {/* <DetailSection title="Language Preferences">
              <DetailItem
                label="Native Language"
                value={user.native_language || "정보 없음"}
              />
              <DetailItem
                label="Preferred Language"
                value={user.preferred_language || "정보 없음"}
              />
            </DetailSection> */}

            <DetailSection title="관심사">
              <div className="flex flex-wrap gap-2">
                {user.interest_keywords &&
                Array.isArray(user.interest_keywords) &&
                user.interest_keywords.length > 0 ? (
                  user.interest_keywords.map((keywords, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-white bg-blue-600 bg-opacity-50 rounded-full"
                    >
                      {keywords}
                    </span>
                  ))
                ) : (
                  <p className="text-white">관심사 정보가 없습니다</p>
                )}
              </div>
            </DetailSection>
          </div>
        </div>

        {statusModalOpen && (
          <StatusChangeModal
            currentStatus={user.status}
            onClose={() => setStatusModalOpen(false)}
            onSubmit={handleStatusChange}
            loading={statusLoading}
          />
        )}
      </motion.div>
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
    <h4 className="text-sm text-gray-400">{title}</h4>
    <p className="text-xl font-semibold text-white">{value}</p>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
    <h3 className="mb-3 font-semibold text-white">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-gray-400">{label}: </span>
    <span className="text-white">{value}</span>
  </div>
);

const StatusChangeModal = ({ currentStatus, onClose, onSubmit, loading }) => {
  const [status, setStatus] = useState(currentStatus || "active");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      status,
      reason,
      duration_days: status === "suspended" ? Number(duration) : undefined,
    });
    onClose();
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg">
        <h3 className="mb-4 text-xl font-semibold text-white">
          사용자 상태 변경
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
              <option value="suspended">정지</option>
              <option value="deleted">삭제</option>
            </select>
          </div>

          {status === "suspended" && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                정지 기간 (일)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
                required
                min="1"
              />
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

export default UserDetail;
