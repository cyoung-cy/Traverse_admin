import { useState } from "react";
import { X, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PostStatusModal = ({ isOpen, onClose, onSubmit, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus || "active");
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        status,
        reason,
        notify_user: notifyUser,
      });
      onClose();
    } catch (error) {
      console.error("Status update error:", error);
      setError("상태 변경 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (statusValue) => {
    switch (statusValue) {
      case "active":
        return {
          label: "활성",
          icon: <CheckCircle size={16} className="mr-2 text-green-500" />,
          description: "모든 사용자가 게시물을 볼 수 있습니다",
        };
      case "pending":
        return {
          label: "대기 중",
          icon: <AlertCircle size={16} className="mr-2 text-yellow-500" />,
          description: "검토 및 승인이 필요한 상태입니다",
        };
      case "hidden":
        return {
          label: "숨김",
          icon: <MessageCircle size={16} className="mr-2 text-blue-500" />,
          description: "게시물이 숨겨지지만 삭제되지는 않습니다",
        };
      case "deleted":
        return {
          label: "삭제됨",
          icon: <X size={16} className="mr-2 text-red-500" />,
          description: "게시물이 삭제된 상태가 됩니다",
        };
      default:
        return { label: "알 수 없음", icon: null, description: "" };
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="overflow-y-auto fixed inset-0 z-50">
        <div className="flex justify-center items-center p-4 min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative p-6 w-full max-w-md bg-gray-800 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-100">
                게시물 상태 변경
              </h3>
              <button
                className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-gray-200"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  상태
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "pending", "hidden", "deleted"].map(
                    (statusOption) => {
                      const { label, icon, description } =
                        getStatusInfo(statusOption);
                      return (
                        <div
                          key={statusOption}
                          className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${
                            status === statusOption
                              ? "border-blue-500 bg-blue-900 bg-opacity-20"
                              : "border-gray-700 hover:border-gray-500"
                          }`}
                          onClick={() => setStatus(statusOption)}
                        >
                          <div className="flex items-center mb-1">
                            {icon}
                            <span className="font-medium text-gray-200">
                              {label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{description}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  사유 (선택사항)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="상태 변경 사유를 입력하세요"
                  className="p-2 w-full h-24 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={notifyUser}
                    onChange={(e) => setNotifyUser(e.target.checked)}
                    className="mr-2 w-4 h-4"
                  />
                  사용자에게 알림
                </label>
              </div>

              {error && (
                <div className="p-3 mb-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg border border-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                      처리 중...
                    </span>
                  ) : (
                    "변경하기"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default PostStatusModal;
