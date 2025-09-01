import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatAPI } from "../../utils/api";
import {
  Loader,
  AlertCircle,
  MessageCircle,
  ArrowLeft,
  Users,
  MessageSquare,
  Flag,
  Clock,
  Info,
  Edit,
  CheckCircle,
  X,
  Archive,
  Ban,
} from "lucide-react";
import { motion } from "framer-motion";

// 통계 카드 컴포넌트
const StatCard = ({ icon: Icon, value, label, color, anim }) => (
  <motion.div
    className="flex flex-col justify-center items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md"
    initial={anim.initial}
    animate={anim.animate}
    transition={anim.transition}
  >
    <Icon size={36} className={`mb-2 ${color}`} />
    <div className="text-2xl font-bold text-gray-200">{value}</div>
    <div className="text-gray-400">{label}</div>
  </motion.div>
);

// 채팅방 정보 필드
const InfoField = ({ label, children }) => (
  <div className="pb-2 border-b border-gray-700">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="flex gap-2 items-center text-gray-200">{children}</div>
  </div>
);

// 상태 뱃지
const StatusBadge = ({ status }) => {
  const statusMap = {
    active: { text: "활성", color: "bg-green-500" },
    archived: { text: "보관", color: "bg-yellow-500" },
    blocked: { text: "차단", color: "bg-red-500" },
  };
  const { text, color } = statusMap[status] || {
    text: status,
    color: "bg-gray-500",
  };
  return (
    <span className={`px-2 py-1 text-xs text-white rounded-full ${color}`}>
      {text}
    </span>
  );
};

// 상태 변경 모달
const StatusModal = ({ room, loading, error, onClose, onChange }) => (
  <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">
          채팅방 상태 변경
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      {error && (
        <div className="p-3 mb-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      <p className="mb-4 text-gray-300">
        현재 상태:{" "}
        <span className="ml-2">
          <StatusBadge status={room.status} />
        </span>
      </p>
      <div className="grid grid-cols-1 gap-3 mb-4">
        {[
          {
            key: "active",
            icon: CheckCircle,
            text: "활성화",
            color: "bg-green-600",
            hover: "hover:bg-green-700",
          },
          {
            key: "archived",
            icon: Archive,
            text: "보관처리",
            color: "bg-yellow-600",
            hover: "hover:bg-yellow-700",
          },
          {
            key: "blocked",
            icon: Ban,
            text: "차단하기",
            color: "bg-red-600",
            hover: "hover:bg-red-700",
          },
        ].map(({ key, icon: Icon, text, color, hover }) => (
          <button
            key={key}
            className={`flex gap-2 justify-center items-center px-4 py-3 text-white rounded-lg ${color} ${hover} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => onChange(key)}
            disabled={loading || room.status === key}
          >
            <Icon size={18} />
            {text}
          </button>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center">
          <Loader size={24} className="text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-300">처리 중...</span>
        </div>
      )}
    </div>
  </div>
);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ChatRoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState(null);

  // 데이터 불러오기
  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChatRoomDetail(roomId, {
        message_limit: 50,
      });
      if (response && response.success && response.data) {
        setRoom(response.data);
        setError(null);
      } else {
        setRoom(null);
        setError("채팅방 정보를 불러올 수 없습니다.");
      }
    } catch (e) {
      setRoom(null);
      setError("채팅방 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) fetchRoomDetails();
  }, [roomId]);

  // 상태 변경
  const handleStatusChange = async (newStatus) => {
    setStatusChangeLoading(true);
    setStatusChangeError(null);
    try {
      const statusData = {
        status: newStatus,
        reason: `관리자에 의해 ${
          newStatus === "active"
            ? "활성화"
            : newStatus === "archived"
            ? "보관"
            : "차단"
        } 처리됨`,
        notify_participants: false,
      };
      const response = await chatAPI.updateChatRoomStatus(roomId, statusData);
      if (response && response.success) {
        fetchRoomDetails();
        setShowStatusModal(false);
      } else {
        setStatusChangeError("채팅방 상태 변경에 실패했습니다.");
      }
    } catch (e) {
      setStatusChangeError("채팅방 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setStatusChangeLoading(false);
    }
  };

  // 로딩/에러/없음 처리
  if (loading)
    return (
      <div className="flex justify-center items-center p-12">
        <Loader size={30} className="text-blue-500 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
        <div className="flex gap-2 items-center p-4 mb-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  if (!room)
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
        <p className="text-center text-gray-400">채팅방을 찾을 수 없습니다</p>
      </div>
    );

  // 통계 데이터
  const stats = [
    {
      icon: Users,
      value: room.participants?.length || 0,
      label: "참여자",
      color: "text-blue-400",
      anim: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3 },
      },
    },
    {
      icon: MessageSquare,
      value: room.message_count || 0,
      label: "메시지",
      color: "text-green-400",
      anim: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.1 },
      },
    },
    {
      icon: Flag,
      value: room.report_count || 0,
      label: "신고 건수",
      color: "text-red-400",
      anim: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, delay: 0.2 },
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
      <div className="space-y-6">
        {/* 상단 버튼 */}
        <div className="flex gap-4 items-center mb-6">
          <button
            className="flex gap-2 items-center px-4 py-2 ml-auto text-gray-200 bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
            onClick={() => setShowStatusModal(true)}
          >
            {" "}
            <Edit size={16} /> 상태 변경{" "}
          </button>
        </div>
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
        {/* 채팅방 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="overflow-y-auto max-h-[600px] p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
            <div className="flex gap-2 items-center pb-3 mb-4 border-b border-gray-700">
              <Info size={18} className="text-blue-400" />
              <h3 className="m-0 text-lg font-semibold text-gray-200">
                채팅방 정보
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              <InfoField label="채팅방 ID">{room.room_id}</InfoField>
              <InfoField label="이름">
                {room.type === "direct" ? (
                  <MessageCircle size={16} className="text-blue-400" />
                ) : (
                  <Users size={16} className="text-green-400" />
                )}
                {room.name}
              </InfoField>
              <InfoField label="유형">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    room.type === "direct" ? "bg-blue-500" : "bg-green-500"
                  } text-white`}
                >
                  {room.type === "direct" ? "1:1" : "그룹"}
                </span>
              </InfoField>
              <InfoField label="상태">
                <StatusBadge status={room.status} />
              </InfoField>
              <InfoField label="생성일">
                <Clock size={16} className="text-gray-400" />
                {formatDate(room.created_at)}
              </InfoField>
              <InfoField label="마지막 메시지">
                <Clock size={16} className="text-gray-400" />
                {formatDate(room.last_message_at)}
              </InfoField>
              <InfoField label="참가자 수">
                {room.participants?.length || 0}
              </InfoField>
              <InfoField label="메시지 수">{room.message_count || 0}</InfoField>
              <InfoField label="신고 건수">{room.report_count || 0}</InfoField>
            </div>
          </div>
        </motion.div>
      </div>
      {/* 상태 변경 모달 */}
      {showStatusModal && (
        <StatusModal
          room={room}
          loading={statusChangeLoading}
          error={statusChangeError}
          onClose={() => setShowStatusModal(false)}
          onChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ChatRoomDetail;
