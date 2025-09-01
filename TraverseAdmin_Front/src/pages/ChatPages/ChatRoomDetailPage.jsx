import React, { useState, useEffect } from "react";
import ChatRoomDetail from "../../components/ChatRooms/ChatRoomDetail";
import ChatMessageList from "../../components/ChatRooms/ChatMessageList";
import ChatMsgModal from "../../components/ChatRooms/ChatMsgModal";
import { useParams } from "react-router-dom";
import { chatAPI } from "../../utils/api";
import {
  Loader,
  AlertCircle,
  AlertTriangle,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";

const ChatRoomDetailPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageLimit, setMessageLimit] = useState(50);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const navigate = useNavigate();

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChatRoomDetail(roomId, {
        message_limit: messageLimit,
      });

      console.log("API 응답:", response);

      if (response && response.success && response.data) {
        const roomData = response.data;
        setRoom(roomData);

        if (roomData.messages && roomData.messages.length > 0) {
          roomData.messages.forEach((msg, idx) => {});
        }

        setError(null);
      } else {
        console.error("API 응답이 올바른 형식이 아닙니다:", response);
        setRoom(null);
        setError("채팅방 정보를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("채팅방 정보를 불러오는데 실패했습니다:", error);
      setRoom(null);
      setError("채팅방 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const handleMessageStatusChange = async (messageId, newStatus) => {
    try {
      await chatAPI.updateChatMessageStatus(messageId, {
        status: newStatus,
        reason: `관리자에 의해 ${
          newStatus === "active"
            ? "복구"
            : newStatus === "hidden"
            ? "숨김"
            : "삭제"
        } 처리됨`,
        notify_user: false,
      });

      fetchRoomDetails();
      setIsModalOpen(false);
    } catch (error) {
      console.error("메시지 상태 변경 실패:", error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
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

  const getAllReports = () => {
    if (!room) return [];

    if (room.reports && Array.isArray(room.reports)) {
      return room.reports
        .map((report) => {
          const message = room.messages?.find(
            (m) => m.message_id === report.message_id
          );
          return {
            ...report,
            message_content: message?.content || "삭제된 메시지",
            username: message?.username || "알 수 없음",
          };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const allReports = [];
    room.messages?.forEach((message) => {
      if (message.reports && message.reports.length > 0) {
        message.reports.forEach((report) => {
          allReports.push({
            ...report,
            message_id: message.message_id,
            message_content: message.content,
            username: message.username,
          });
        });
      }
    });

    return allReports.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  };

  const getReportStatusBadge = (status) => {
    const statusMap = {
      pending: { className: "bg-yellow-500", text: "대기중" },
      resolved: { className: "bg-green-500", text: "처리됨" },
      rejected: { className: "bg-red-500", text: "거부됨" },
    };

    return statusMap[status] || { className: "bg-gray-500", text: status };
  };

  const navigateToMessage = (messageId) => {
    const message = room.messages.find((msg) => msg.message_id === messageId);
    if (message) {
      setActiveTab("messages");
      handleMessageClick(message);
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft size={32} className="mr-3 text-blue-400" />
          <span className="text-base font-semibold">뒤로가기</span>
        </button>
        <div className="flex justify-center items-center p-12">
          <Loader size={30} className="text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft size={32} className="mr-3 text-blue-400" />
          <span className="text-base font-semibold">뒤로가기</span>
        </button>
        <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
          <div className="flex gap-2 items-center p-4 mb-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="채팅방 상세" />
      <div className="container px-2 py-4 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft size={32} className="mr-3 text-blue-400" />
          <span className="text-base font-semibold">뒤로가기</span>
        </button>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <ChatRoomDetail />
          </div>
          <div>
            <div className="mb-2 border-b border-gray-700">
              <div className="flex gap-2">
                {/* <button
                  className={`pb-1 px-3 text-xs font-medium ${
                    activeTab === "messages"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  메시지 목록
                </button> */}
                <button
                  className={`pb-1 px-3 text-xs font-medium ${
                    activeTab === "reports"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  신고 목록
                </button>
              </div>
            </div>
            {/* {activeTab === "messages" && room && room.messages && (
              <ChatMessageList
                messages={room.messages}
                onMessageStatusChange={handleMessageStatusChange}
                onMessageClick={handleMessageClick}
              />
            )} */}
            {activeTab === "reports" && room && room.messages && (
              <div className="overflow-y-auto max-h-[600px] p-3 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700 backdrop-blur-md">
                <div className="flex gap-2 items-center pb-2 mb-2 border-b border-gray-700">
                  <AlertTriangle size={15} className="text-red-400" />
                  <h3 className="m-0 text-base font-semibold text-gray-200">
                    신고 목록
                  </h3>
                </div>

                <ul className="divide-y divide-gray-700">
                  {getAllReports().length === 0 ? (
                    <li className="py-2 text-sm text-center text-gray-400">
                      신고된 메시지가 없습니다
                    </li>
                  ) : (
                    getAllReports().map((report) => (
                      <li
                        key={report.report_id}
                        className="py-2 px-2 flex items-center group hover:bg-gray-700/60 rounded transition-colors cursor-pointer min-h-[48px]"
                        onClick={() => navigateToMessage(report.message_id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-2 items-center text-xs text-gray-400">
                            <AlertTriangle size={12} className="text-red-400" />
                            <span className="font-medium text-gray-200">
                              신고
                            </span>
                            <span className="flex gap-1 items-center ml-2 text-gray-500">
                              <Clock size={11} />
                              {formatDate(report.created_at)}
                            </span>
                          </div>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-xs text-gray-400">
                              메시지:
                            </span>
                            <span className="text-xs text-gray-300 truncate max-w-[180px]">
                              {report.chat_content}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              작성자:
                            </span>
                            <span className="text-xs text-gray-300">
                              {report.reported_user_name}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              신고자:
                            </span>
                            <span className="text-xs text-gray-300">
                              {report.reporter_name}({report.reporter_user_id})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-2 min-w-[90px]">
                          <div className="flex gap-1 mb-1">
                            {(() => {
                              const statusInfo = getReportStatusBadge(
                                report.status
                              );
                              return (
                                <span
                                  className={`px-2 py-0.5 text-[11px] rounded-full ${statusInfo.className} text-white`}
                                >
                                  {statusInfo.text}
                                </span>
                              );
                            })()}
                            <span className="px-2 py-0.5 text-[11px] text-white bg-gray-600 rounded-full">
                              {report.reason}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMessage && (
        <ChatMsgModal
          isOpen={isModalOpen}
          message={selectedMessage}
          onClose={closeModal}
          onStatusChange={handleMessageStatusChange}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ChatRoomDetailPage;
