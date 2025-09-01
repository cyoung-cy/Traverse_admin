import React, { useState } from "react";
import { chatAPI } from "../../utils/api";
import {
  EyeOff,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  User,
  AlertTriangle,
  Clock,
  MoreVertical,
} from "lucide-react";

const ChatMessageList = ({
  messages = [],
  onMessageStatusChange,
  onMessageClick,
}) => {
  const [messageActionId, setMessageActionId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmHide, setConfirmHide] = useState(false);

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

      if (onMessageStatusChange) {
        onMessageStatusChange(messageId, newStatus);
      }
      setMessageActionId(null);
      setConfirmDelete(false);
      setConfirmHide(false);
    } catch (error) {
      console.error("메시지 상태 변경 실패:", error);
    }
  };

  const getMessageTypeLabel = (message) => {
    // API 응답에서 직접 타입을 사용
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-y-auto max-h-[600px] p-3 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700 backdrop-blur-md">
      <div className="flex gap-2 items-center pb-2 mb-2 border-b border-gray-700">
        <MessageSquare size={15} className="text-blue-400" />
        <h3 className="m-0 text-base font-semibold text-gray-200">
          메시지 목록
        </h3>
      </div>

      <ul className="divide-y divide-gray-700">
        {messages.length === 0 ? (
          <li className="py-2 text-sm text-center text-gray-400">
            메시지가 없습니다
          </li>
        ) : (
          messages.map((message) => (
            <li
              key={message.message_id}
              className="relative py-2 px-2 flex items-center group hover:bg-gray-700/60 rounded transition-colors cursor-pointer min-h-[48px]"
              onClick={() => onMessageClick && onMessageClick(message)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center text-xs text-gray-400">
                  <User size={12} className="text-gray-400" />
                  <span className="font-medium text-gray-200 truncate max-w-[80px]">
                    {message.username}
                  </span>
                  <span className="text-gray-500">({message.user_id})</span>
                  <span className="flex gap-1 items-center ml-2 text-gray-500">
                    <Clock size={11} />
                    {formatDate(message.created_at)}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      getMessageTypeLabel(message).className
                    } text-white`}
                    style={{ fontSize: "11px" }}
                  >
                    {getMessageTypeLabel(message).icon}
                    {getMessageTypeLabel(message).label}
                  </span>
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <p className="text-gray-300 text-sm truncate max-w-[320px] mb-0">
                    {message.content}
                  </p>
                  {message.type === "image" && (
                    <ImageIcon size={16} className="ml-1 text-green-400" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end ml-2 min-w-[80px]">
                <div className="flex gap-1 mb-1">
                  {message.is_reported && (
                    <span className="flex gap-1 items-center px-1.5 py-0.5 text-[11px] text-white bg-red-500 rounded-full">
                      <AlertTriangle size={10} />
                      신고
                      {message.reports && message.reports.length > 0
                        ? `(${message.reports.length})`
                        : message.report_count > 0
                        ? `(${message.report_count})`
                        : ""}
                    </span>
                  )}
                  {message.is_deleted && (
                    <span className="flex gap-1 items-center px-1.5 py-0.5 text-[11px] text-white bg-red-500 rounded-full">
                      <Trash2 size={10} /> 삭제
                    </span>
                  )}
                  {message.is_hidden && (
                    <span className="flex gap-1 items-center px-1.5 py-0.5 text-[11px] text-white bg-yellow-500 rounded-full">
                      <EyeOff size={10} /> 숨김
                    </span>
                  )}
                </div>
                <button
                  className="p-1 rounded-full transition-colors hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessageActionId(
                      messageActionId === message.message_id
                        ? null
                        : message.message_id
                    );
                  }}
                >
                  <MoreVertical size={14} className="text-gray-400" />
                </button>
                {messageActionId === message.message_id && (
                  <div
                    className="overflow-hidden absolute right-2 top-12 z-10 w-28 bg-gray-800 rounded-md border border-gray-700 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {confirmHide && messageActionId === message.message_id ? (
                      <div className="p-2">
                        <p className="mb-2 text-xs text-gray-300">
                          정말 숨기시겠습니까?
                        </p>
                        <div className="flex gap-1 justify-between">
                          <button
                            className="flex-1 p-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() =>
                              handleMessageStatusChange(
                                message.message_id,
                                "hidden"
                              )
                            }
                          >
                            확인
                          </button>
                          <button
                            className="flex-1 p-1 text-xs text-gray-200 bg-gray-600 rounded hover:bg-gray-500"
                            onClick={() => setConfirmHide(false)}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : confirmDelete &&
                      messageActionId === message.message_id ? (
                      <div className="p-2">
                        <p className="mb-2 text-xs text-gray-300">
                          정말 삭제하시겠습니까?
                        </p>
                        <div className="flex gap-1 justify-between">
                          <button
                            className="flex-1 p-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() =>
                              handleMessageStatusChange(
                                message.message_id,
                                "deleted"
                              )
                            }
                          >
                            확인
                          </button>
                          <button
                            className="flex-1 p-1 text-xs text-gray-200 bg-gray-600 rounded hover:bg-gray-500"
                            onClick={() => setConfirmDelete(false)}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          className="flex gap-1 items-center p-2 w-full text-xs text-left text-gray-200 hover:bg-gray-700"
                          onClick={() => setConfirmHide(true)}
                        >
                          <EyeOff size={12} /> 숨기기
                        </button>
                        <button
                          className="flex gap-1 items-center p-2 w-full text-xs text-left text-red-400 hover:bg-gray-700"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Trash2 size={12} /> 삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ChatMessageList;
