import React, { useState, useRef } from "react";
import { notificationAPI } from "../../utils/api";

const NotificationModal = ({ open, onClose, onSuccess, template }) => {
  const [name, setName] = useState(template?.name || "");
  const [content, setContent] = useState(template?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const [isAnnouncement, setIsAnnouncement] = useState(true);
  const [imageUrl, setImageUrl] = useState(template?.image_url || "");
  const [sentAt, setSentAt] = useState(new Date().toISOString());
  const [sentBy, setSentBy] = useState(template?.sent_by || "admin");
  const [notificationCategory, setNotificationCategory] = useState(
      template?.notification_category || "SYSTEM"
  );
  const [type, setType] = useState(template?.type || "announcement");

  const getCategoryLabel = (category) => {
    switch (category) {
      case "SYSTEM":
        return "시스템";
      case "UPDATE":
        return "업데이트";
      case "MAINTENANCE":
        return "점검";
      case "EVENT":
        return "이벤트";
      default:
        return "공지";
    }
  };

  React.useEffect(() => {
    if (open) {
      setName(template?.name || "");
      setContent(template?.content || "");
      setIsAnnouncement(template?.is_announcement ?? true);
      setImageUrl(template?.image_url || "");
      setSentAt(new Date().toISOString());
      setSentBy(template?.sent_by || "admin");
      setNotificationCategory(template?.notification_category || "SYSTEM");
      setType(template?.type || "announcement");
    }
  }, [open, template]);


  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await notificationAPI.sendNotification({
        title: name,
        content: content,
        image_url: imageUrl,
        action_url: "", // 비어있으면 빈 문자열로 넣어주세요
        type: type,
        notification_category: notificationCategory,
        is_announcement: isAnnouncement || false,
        recipient_count: 0, // 필요하면 계산해서 넣기
        read_count: 0, // 기본 0
        reference_id: "", // 필요하면 값 넣기
        sent_at: sentAt, // ISO 문자열 그대로 보내기
        sent_by: sentBy,
        recipients: ["all"],
        template_id: "custom",
        variables: {}, // 만약 필요하면 빈 객체라도 보내기
        send_immediately: true,
      });
      console.log("알림 전송 응답:", response);
      if (onSuccess) {
        onSuccess(response);
      }
      onClose();
    } catch (e) {
      console.error("알림 전송 오류:", e);
      setError("알림 전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-gray-800 rounded-lg border border-gray-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="mb-4 text-xl font-bold text-gray-100">알림 전송</h2>
          <div className="mb-2 text-sm text-gray-400">
            아래 입력값을 채우고 알림을 바로 전송할 수 있습니다.
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                제목
              </label>
              <input
                  type="text"
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
              />
            </div>
            <div className="mb-4">
              <div className="flex gap-2 items-center mb-1">
                <label className="block font-semibold text-gray-200">내용</label>
              </div>
              <div className="relative">
              <textarea
                  ref={textareaRef}
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={loading}
                  rows={4}
                  spellCheck={false}
                  autoComplete="off"
              />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                공지 여부 (is_announcement)
              </label>
              <input
                  type="checkbox"
                  checked={isAnnouncement}
                  onChange={(e) => setIsAnnouncement(e.target.checked)}
                  disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                이미지 URL (image_url)
              </label>
              <input
                  type="file"
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
              />
            </div>
            {/* <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">
              발송 시각 (sent_at, ISO 8601)
            </label>
            <input
              type="datetime-local"
              className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              value={sentAt}
              onChange={(e) => setSentAt(e.target.value)}
              disabled={loading}
            />
          </div> */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                발송자 (sent_by)
              </label>
              <input
                  type="text"
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={sentBy}
                  onChange={(e) => setSentBy(e.target.value)}
                  disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                알림 카테고리
              </label>
              <select
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={notificationCategory}
                  onChange={(e) => setNotificationCategory(e.target.value)}
                  disabled={loading}
              >
                <option value="SYSTEM">시스템</option>
                <option value="UPDATE">업데이트</option>
                <option value="MAINTENANCE">점검</option>
                <option value="EVENT">이벤트</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">
                알림 타입 (type)
              </label>
              <input
                  type="text"
                  className="px-3 py-2 w-full text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={loading}
              />
            </div>
            {error && <div className="mb-2 text-red-400">{error}</div>}
            <div className="flex gap-2 justify-end">
              <button
                  type="button"
                  className="px-4 py-2 text-gray-200 bg-gray-700 rounded border border-gray-600 hover:bg-gray-600"
                  onClick={onClose}
                  disabled={loading}
              >
                취소
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded border border-blue-700 hover:bg-blue-700"
                  disabled={loading}
              >
                {loading ? "전송 중..." : "전송"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default NotificationModal;
