import React, { useEffect, useState } from "react";
import { inquiriesAPI } from "../../utils/api";

const statusColor = {
  pending: "bg-yellow-900 text-yellow-200 border-yellow-600",
  answered: "bg-green-900 text-green-200 border-green-600",
};
const statusText = {
  pending: "대기 중",
  answered: "답변 완료",
};

const InquiryDetail = ({ inquiryId }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 문의 상세 조회
  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inquiriesAPI.getInquiryDetail(inquiryId);
      setInquiry(res.data.data);
      setAnswer("");
    } catch (e) {
      setError("상세 정보를 불러오지 못했습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inquiryId) fetchDetail();
    // eslint-disable-next-line
  }, [inquiryId]);

  // 상태 변경
  const handleStatusChange = async (newStatus) => {
    setStatusSubmitting(true);
    setSuccessMsg("");
    try {
      await inquiriesAPI.updateInquiryStatus(inquiryId, { status: newStatus });
      setSuccessMsg("상태가 변경되었습니다.");
      fetchDetail();
    } catch (e) {
      setError("상태 변경에 실패했습니다.");
    }
    setStatusSubmitting(false);
  };

  // 답변 등록
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    setSuccessMsg("");
    try {
      await inquiriesAPI.createInquiryReply(inquiryId, {
        message: answer,
      });
      // 답변 등록 성공 시 상태도 자동 변경
      await inquiriesAPI.updateInquiryStatus(inquiryId, { status: "answered" });
      setSuccessMsg("답변이 등록되고 상태가 '답변 완료'로 변경되었습니다.");
      setAnswer("");
      fetchDetail();
    } catch (e) {
      setError("답변 등록 또는 상태 변경에 실패했습니다.");
    }
    setSubmitting(false);
  };

  if (loading)
    return (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 rounded-full border-b-2 border-blue-400 animate-spin" />
        </div>
    );
  if (error)
    return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!inquiry) return null;

  return (
      <div className="p-8 mx-auto mt-4 max-w-2xl bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="flex gap-2 items-center mb-8 text-3xl font-extrabold text-white">
          <span className="inline-block mr-2 w-2 h-8 bg-blue-400 rounded-full" />
          문의 상세
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-lg text-gray-400">카테고리</span>
            <span className="text-sm font-semibold text-blue-200">
            {inquiry.category}
          </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg text-gray-400">작성일</span>
            <span className="text-sm font-semibold text-gray-100">
            {inquiry.created_at?.slice(0, 10)}
          </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg text-gray-400">상태</span>
            <span
                className={`inline-block px-3 py-1 rounded-full border text-sm font-bold ${
                    statusColor[inquiry.status] ||
                    "bg-gray-700 text-gray-200 border-gray-500"
                }`}
            >
            {statusText[inquiry.status] || inquiry.status}
          </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg text-gray-400">문의자 ID</span>
            <span className="text-sm font-semibold text-white">
            {inquiry.user_id}
          </span>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-1 text-lg text-gray-400">문의 내용</div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white whitespace-pre-line min-h-[80px] max-h-64 overflow-auto">
            {inquiry.message}
          </div>
        </div>
        {inquiry.answer ? (
            <div className="mb-8">
              <div className="mb-1 text-lg text-gray-400">답변</div>
              <div className="p-4 text-white bg-green-900 rounded-lg border border-green-700">
                <div className="mb-2">{inquiry.answer.message}</div>
                <div className="flex gap-2 items-center text-xs text-green-200">
              <span>
                답변자:{" "}
                <span className="font-semibold">{inquiry.answer.admin_id}</span>
              </span>
                  <span>·</span>
                  <span>
                {inquiry.answer.answered_at?.slice(0, 16).replace("T", " ")}
              </span>
                </div>
              </div>
            </div>
        ) : (
            <form onSubmit={handleSubmitAnswer} className="mb-8">
              <div className="flex justify-between mb-1 text-sm text-gray-400">
                답변 작성
                <span className="text-xs text-gray-500">최대 1000자</span>
              </div>

              <textarea
                  className="w-full p-3 rounded-lg border-2 border-blue-900 focus:border-blue-400 bg-gray-900 text-white min-h-[100px] resize-none transition"
                  rows={5}
                  placeholder="답변 내용을 입력하세요"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={submitting}
                  maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                {/* <span className="text-xs text-gray-500">최대 1000자</span> */}
                <button
                    type="submit"
                    className="px-6 py-2 font-bold text-white bg-blue-600 rounded-lg shadow transition hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting || !answer.trim()}
                >
                  {submitting ? (
                      <span className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-b-2 border-white animate-spin" />{" "}
                        등록 중...
                </span>
                  ) : (
                      "답변 등록"
                  )}
                </button>
              </div>
            </form>
        )}
        <div className="flex gap-3 mt-2">
          {/* '답변 완료로 변경' 버튼 삭제됨 */}
        </div>
        {successMsg && (
            <div className="mt-6 font-semibold text-center text-green-400 animate-fade-in">
              {successMsg}
            </div>
        )}
      </div>
  );
};

export default InquiryDetail;
