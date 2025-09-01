import React from "react";
import {
  AlertTriangle,
  X,
  Clock,
  User,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  EyeOff,
  Trash2,
  RefreshCw,
} from "lucide-react";

const ChatMsgModal = ({
  isOpen,
  message,
  onClose,
  onStatusChange,
  formatDate,
}) => {

  console.log("모달 isOpen:", isOpen);
  console.log("모달 message:", message);

  if (!isOpen || !message) return null;

  const getMessageStatusBadge = () => {
    if (message.is_deleted) {
      return (
        <span className="flex gap-1 items-center px-2 py-1 text-xs text-white bg-red-500 rounded-full">
          <Trash2 size={12} />
          삭제됨
        </span>
      );
    }

    if (message.is_hidden) {
      return (
        <span className="flex gap-1 items-center px-2 py-1 text-xs text-white bg-yellow-500 rounded-full">
          <EyeOff size={12} />
          숨김
        </span>
      );
    }

    return (
      <span className="flex gap-1 items-center px-2 py-1 text-xs text-white bg-green-500 rounded-full">
        <MessageSquare size={12} />
        활성
      </span>
    );
  };

  const getMessageTypeLabel = (message) => {
    // 메시지 타입 정보
    const type = message.type || "text";

    const types = {
      text: {
        icon: <MessageSquare size={14} className="mr-1 text-white" />,
        label: "텍스트",
        className: "bg-blue-500",
      },
      image: {
        icon: <ImageIcon size={14} className="mr-1 text-white" />,
        label: "이미지",
        className: "bg-green-500",
      },
      file: {
        icon: <FileText size={14} className="mr-1 text-white" />,
        label: "파일",
        className: "bg-orange-500",
      },
    };

    return types[type] || types.text;
  };

  const typeInfo = getMessageTypeLabel(message);

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">메시지 상세</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* 메시지 정보 헤더 */}
          <div className="mb-6">
            <div className="flex gap-2 items-start mb-2">
              <User size={18} className="mt-1 text-gray-400" />
              <div>
                <div className="flex gap-1 items-center">
                  <span className="font-medium text-gray-200">
                    {message.username}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({message.user_id})
                  </span>
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <span className="flex gap-1 items-center text-xs text-gray-400">
                    <Clock size={12} />
                    {formatDate
                      ? formatDate(message.created_at)
                      : message.created_at}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {getMessageStatusBadge()}

              <span
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${typeInfo.className} text-white`}
              >
                {typeInfo.icon}
                {typeInfo.label}
              </span>

              {message.is_reported && (
                <span className="flex gap-1 items-center px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                  <AlertTriangle size={12} />
                  신고됨{" "}
                  {message.reports && message.reports.length > 0
                    ? `(${message.reports.length})`
                    : message.report_count > 0
                    ? `(${message.report_count})`
                    : ""}
                </span>
              )}
            </div>
          </div>

          {/* 메시지 본문 */}
          <div className="p-4 mb-6 w-full text-gray-200 bg-gray-700 bg-opacity-50 rounded-lg">
            <p className="mb-4 whitespace-pre-wrap">{message.content}</p>

            {message.type === "image" && (
              <div className="flex justify-center items-center p-4 mt-4 text-gray-300 bg-gray-600 bg-opacity-30 rounded">
                <ImageIcon size={24} className="mr-2 text-green-400" />
                <span>이미지 메시지</span>
              </div>
            )}
          </div>

          {/* 신고 정보 */}
          {message.is_reported && (
            <div className="mb-6">
              <h4 className="flex gap-2 items-center mb-3 font-semibold text-gray-200">
                <AlertTriangle size={16} className="text-red-500" />
                신고 내역 ({message.report_count})
              </h4>
              <div className="p-4 text-gray-300 bg-gray-700 bg-opacity-30 rounded">
                <p>
                  이 메시지는 신고되었습니다. 신고 내역은 신고 목록 탭에서
                  확인할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 메시지 관리 버튼 */}
          <div className="flex gap-3 justify-end mt-6">
            {!message.is_deleted && !message.is_hidden && (
              <button
                onClick={() => onStatusChange(message.message_id, "hidden")}
                className="flex gap-1 items-center px-3 py-2 text-sm text-yellow-500 bg-yellow-500 bg-opacity-10 rounded hover:bg-opacity-20"
              >
                <EyeOff size={16} />
                숨기기
              </button>
            )}

            {!message.is_deleted && (
              <button
                onClick={() => onStatusChange(message.message_id, "deleted")}
                className="flex gap-1 items-center px-3 py-2 text-sm text-red-500 bg-red-500 bg-opacity-10 rounded hover:bg-opacity-20"
              >
                <Trash2 size={16} />
                삭제
              </button>
            )}

            {(message.is_deleted || message.is_hidden) && (
              <button
                onClick={() => onStatusChange(message.message_id, "active")}
                className="flex gap-1 items-center px-3 py-2 text-sm text-green-500 bg-green-500 bg-opacity-10 rounded hover:bg-opacity-20"
              >
                <RefreshCw size={16} />
                복구
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMsgModal;
