import { useState } from "react";
import { X } from "lucide-react";

const ReportProcessModal = ({
  isOpen,
  onClose,
  onSubmit,
  reportId,
  type = "user",
  isUnsuspend = false,
}) => {
  const [formData, setFormData] = useState({
    status: "resolved",
    action_taken: isUnsuspend ? "unsuspend" : "none",
    comment: "",
    notify_reporter: true,
    notify_reported: true,
    suspension_duration: 7,
    delete_post: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (
      formData.action_taken === "suspend" &&
      (!formData.suspension_duration || formData.suspension_duration <= 0)
    ) {
      errors.suspension_duration = "정지 기간은 1일 이상이어야 합니다.";
    }

    if (formData.status === "resolved" && !formData.comment.trim()) {
      errors.comment = "처리 완료 시 코멘트를 입력해주세요.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      if (type !== "post") {
        delete submitData.delete_post;
      }
      await onSubmit(reportId, submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      status: "resolved",
      action_taken: isUnsuspend ? "unsuspend" : "none",
      comment: "",
      notify_reporter: true,
      notify_reported: true,
      suspension_duration: 7,
      delete_post: false,
    });
    setFormErrors({});
    onClose();
  };

  const actionOptions = isUnsuspend
    ? [{ value: "unsuspend", label: "정지 해제" }]
    : [
        { value: "none", label: "징계 없음" },
        { value: "warn", label: "경고" },
        { value: "suspend", label: "정지" },
        { value: "ban", label: "영구 정지" },
      ];

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-2xl bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">
            {isUnsuspend ? "정지 해제" : "신고 처리"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 rounded-full hover:text-gray-200 hover:bg-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              처리 상태
            </label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value;
                setFormData({
                  ...formData,
                  status: newStatus,
                  action_taken:
                    newStatus === "rejected" ? "none" : formData.action_taken,
                });
              }}
              className="p-2 w-full text-gray-100 bg-gray-700 rounded border border-gray-600"
              disabled={isSubmitting}
            >
              <option value="resolved">처리 완료</option>
              <option value="rejected">거부</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              조치 사항
            </label>
            <select
              value={formData.action_taken}
              onChange={(e) =>
                setFormData({ ...formData, action_taken: e.target.value })
              }
              className="p-2 w-full text-gray-100 bg-gray-700 rounded border border-gray-600"
              disabled={
                isSubmitting || isUnsuspend || formData.status === "rejected"
              }
            >
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {formData.action_taken === "suspend" && !isUnsuspend && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                정지 기간 (일)
              </label>
              <input
                type="number"
                min="1"
                value={formData.suspension_duration || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    suspension_duration:
                      value === "" ? "" : Math.max(1, parseInt(value) || 1),
                  });
                }}
                className={`p-2 w-full text-gray-100 bg-gray-700 rounded border ${
                  formErrors.suspension_duration
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.suspension_duration && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.suspension_duration}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              관리자 코멘트
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows="4"
              className={`p-2 w-full text-gray-100 bg-gray-700 rounded border ${
                formErrors.comment ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="처리 내용에 대한 코멘트를 입력하세요"
              disabled={isSubmitting}
            />
            {formErrors.comment && (
              <p className="mt-1 text-sm text-red-500">{formErrors.comment}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.notify_reported}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notify_reported: e.target.checked,
                  })
                }
                className="text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span>신고 대상자에게 알림</span>
            </label>
          </div>

          {type === "post" && !isUnsuspend && (
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.delete_post}
                onChange={(e) =>
                  setFormData({ ...formData, delete_post: e.target.checked })
                }
                className="text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span>게시물 삭제</span>
            </label>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                isUnsuspend ? "bg-green-600" : "bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "처리 중..."
                : isUnsuspend
                ? "정지 해제"
                : "처리하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportProcessModal;
