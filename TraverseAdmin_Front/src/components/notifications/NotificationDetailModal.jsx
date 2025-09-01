// ✅ NotificationDetailModal.jsx
import React, { useEffect } from "react";

const NotificationDetailModal = ({ notification, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getCategoryLabel = (category) => {
        switch ((category || "").toUpperCase()) {
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

    return (
        <div
            className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            style={{ display: notification ? "flex" : "none" }} // 👈 내부에서는 display 제어
        >
            <div className="p-8 mx-4 w-full max-w-5xl bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-white">알림 상세 정보</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-xl text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {notification && (
                    <div className="space-y-6">
                        {/* 제목 섹션 */}
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <label className="block mb-2 text-base font-medium text-gray-300">
                                제목
                            </label>
                            <p className="text-lg text-white">{notification.title}</p>
                        </div>

                        {/* 내용 섹션 */}
                        <div className="p-6 bg-gray-700 rounded-lg">
                            <label className="block mb-3 text-base font-medium text-gray-300">
                                내용
                            </label>
                            <div className="p-4 bg-gray-800 rounded max-h-[220px] overflow-y-auto">
                                <p className="text-base leading-relaxed text-white whitespace-pre-wrap">
                                    {notification.content}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* 기본 정보 */}
                            <div className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="mb-3 text-lg font-medium text-white">기본 정보</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            카테고리
                                        </label>
                                        <p className="text-white">
                                            {getCategoryLabel(notification.notification_category)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            타입
                                        </label>
                                        <p className="text-white">{notification.type}</p>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            발송일시
                                        </label>
                                        <p className="text-white">
                                            {notification.sent_at
                                                ? new Date(notification.sent_at).toLocaleString("ko-KR")
                                                : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            발송자
                                        </label>
                                        <p className="text-white">{notification.sent_by || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 통계 정보 */}
                            <div className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="mb-3 text-lg font-medium text-white">통계 정보</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            수신자 수
                                        </label>
                                        <p className="text-white">
                                            {notification.recipient_count || 0}명
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-base font-medium text-gray-300">
                                            읽음 수
                                        </label>
                                        <p className="text-white">{notification.read_count || 0}명</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 이미지 */}
                        {notification.image_url && (
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <label className="block mb-2 text-base font-medium text-gray-300">
                                    이미지
                                </label>
                                <div className="mt-2">
                                    <img
                                        src={notification.image_url}
                                        alt="알림 이미지"
                                        className="max-w-full rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 액션 URL */}
                        {notification.action_url && (
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <label className="block mb-2 text-base font-medium text-gray-300">
                                    액션 URL
                                </label>
                                <a
                                    href={notification.action_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 break-all hover:text-blue-300"
                                >
                                    {notification.action_url}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDetailModal;
