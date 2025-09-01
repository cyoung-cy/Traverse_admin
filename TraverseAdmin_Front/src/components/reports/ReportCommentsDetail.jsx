import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { reportsAPI } from "../../utils/api";
import ReportProcessModal from "./ReportProcessModal";
import Header from "../common/Header";
import ImageModal from "../common/ImageModal";

const ReportCommentsDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isUnsuspendModalOpen, setIsUnsuspendModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportsAPI.getReportDetail(reportId);
        if (response && response.data) {
          setReport(response.data);
          setError(null);
        } else {
          setReport(null);
          setError("신고 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        setReport(null);
        setError("신고 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    console.log("report 상태 변경:", report);
  }, [report]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "resolved":
        return "처리 완료";
      case "rejected":
        return "거부됨";
      default:
        return "알 수 없음";
    }
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
  const handleProcessReport = async (reportId, processData) => {
    try {
      const processResponse = await reportsAPI.processReport(
        reportId,
        processData
      );
      if (!processResponse) {
        setError("신고 처리 요청이 실패했습니다.");
        return;
      }

      // 신고 정보 새로고침
      const response = await reportsAPI.getReportDetail(reportId);
      if (response && response.data) {
        setReport(response.data.data);
        setIsProcessModalOpen(false);
        setIsUnsuspendModalOpen(false);
        setError(null);
      } else {
        console.error("API 응답이 올바른 형식이 아닙니다:", response);
        setError("처리 후 신고 정보를 불러올 수 없습니다.");
      }
    } catch (error) {
      setError("신고 처리 중 오류가 발생했습니다.");
      console.error("Error processing report:", error);
    }
  };

  const handleUnsuspend = async (reportId, processData) => {
    try {
      const processResponse = await reportsAPI.processReport(reportId, {
        ...processData,
        action: "unsuspend",
        action_taken: "정지 해제",
        suspend_duration: null,
        suspend_start: null,
      });
      if (!processResponse) {
        setError("정지 해제 요청이 실패했습니다.");
        return;
      }

      // 신고 정보 새로고침
      const response = await reportsAPI.getReportDetail(reportId);
      if (response && response.data) {
        setReport(response.data.data);
        setIsUnsuspendModalOpen(false);
        setError(null);
      } else {
        console.error("API 응답이 올바른 형식이 아닙니다:", response);
        setError("처리 후 신고 정보를 불러올 수 없습니다.");
      }
    } catch (error) {
      setError("정지 해제 중 오류가 발생했습니다.");
      console.error("Error unsuspending report:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">로딩 중...</div>;
  }
  if (!report) {
    return (
      <div className="p-6 text-center text-gray-400">
        신고 정보를 찾을 수 없습니다.
      </div>
    );
  }
  const handleEvidenceImageClick = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="댓글 신고 상세 정보" />
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
      >
        <ArrowLeft size={32} className="mr-3 text-blue-400" />
        <span className="text-base font-semibold">뒤로가기</span>
      </button>
      <div className="grid grid-cols-1 gap-6 px-4 py-6 mx-auto max-w-7xl md:grid-cols-3 lg:px-8">
        {/* 좌측: 기본/신고자/신고대상자 정보 (1fr) */}
        <div className="space-y-6 md:col-span-1">
          <div className="overflow-y-auto p-6 h-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              기본/신고자/신고 대상자 정보
            </h2>
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="pb-4 space-y-2 border-b border-gray-700">
                <h3 className="mb-2 text-lg font-semibold text-blue-300">
                  기본 정보
                </h3>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">신고 ID</h4>
                  <p className="text-sm text-gray-200">{report.report_id}</p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">상태</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      report.status
                    )} text-white`}
                  >
                    {getStatusText(report.status)}
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">신고일</h4>
                  <p className="text-sm text-gray-200">
                    {formatDate(report.created_at)}
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">심각도</h4>
                  <p className="text-sm text-gray-200">{report.severity}</p>
                </div>
              </div>
              {/* 신고자 정보 */}
              <div className="pb-6 space-y-2 border-b border-gray-700">
                <h3 className="mb-2 text-lg font-semibold text-green-300">
                  신고자 정보
                </h3>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">사용자 ID</h4>
                  <p className="text-sm text-gray-200">
                    {report.reporter_user_id}
                  </p>
                </div>
              </div>
              {/* 신고 대상자 정보 */}
              <div className="space-y-2">
                <h3 className="mb-2 text-lg font-semibold text-red-300">
                  신고 대상자 정보
                </h3>
                <div>
                  <h4 className="mb-1 font-medium text-gray-400">사용자명</h4>
                  <p className="text-sm text-gray-200">
                    {report.target_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 우측: 신고 내용 + 댓글 정보 (2fr) */}
        <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 md:col-span-2 h-fit">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">
            신고 내용
          </h2>
          <div className="space-y-4">
            {/* 댓글 정보 */}
            <div className="flex gap-24">
              <div>
                <h3 className="mb-1 font-medium text-gray-400">댓글 ID</h3>
                <p className="text-sm text-gray-200">{report.comment_id}</p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-gray-400">신고 사유</h3>
                <p className="text-sm text-gray-200">{report.reason}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-gray-400">댓글 내용</h3>
              <p className="text-sm text-gray-200">
                {report?.comment_content ?? "-"}
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-gray-400">상세 설명</h3>
              <p className="text-sm text-gray-200">{report.description}</p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-gray-400">상위 댓글 ID</h3>
              <p className="text-sm text-gray-200">
                {report.parent_comment_id ?? "-"}
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-gray-400">게시물 ID</h3>
              <p className="text-sm text-gray-200">{report.post_id ?? "-"}</p>
            </div>
            {report.evidence && report.evidence.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium text-gray-400">증거 자료</h3>
                <div className="flex overflow-x-auto flex-wrap gap-4">
                  {report.evidence.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`증거 이미지 ${idx + 1}`}
                      className="object-cover w-32 h-32 rounded transition-transform cursor-pointer hover:scale-105"
                      onClick={() => handleEvidenceImageClick(url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {report.processed_at && (
          <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 md:col-span-3">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              처리 정보
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-medium text-gray-400">처리자</h3>
                <p className="text-gray-200">{report.processed_by}</p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-gray-400">처리일</h3>
                <p className="text-gray-200">
                  {formatDate(report.processed_at)}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-gray-400">처리 내용</h3>
                <p className="text-gray-200">{report.action_taken}</p>
              </div>
              {report.suspend_duration && report.suspend_start && (
                <>
                  <div>
                    <h3 className="mb-1 font-medium text-gray-400">
                      정지 일 수
                    </h3>
                    <p className="text-gray-200">{report.suspend_duration}일</p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium text-gray-400">
                      정지 기간
                    </h3>
                    <p className="text-gray-200">
                      {formatDate(report.suspend_start)} ~{" "}
                      {formatDate(
                        new Date(
                          new Date(report.suspend_start).getTime() +
                            report.suspend_duration * 24 * 60 * 60 * 1000
                        )
                      )}
                    </p>
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <h3 className="mb-1 font-medium text-gray-400">
                  관리자 코멘트
                </h3>
                <p className="text-gray-200">{report.comment}</p>
              </div>
            </div>
          </div>
        )}
        {report.status === "pending" && (
          <div className="flex justify-end mt-4 md:col-span-3">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
              onClick={() => setIsProcessModalOpen(true)}
            >
              처리하기
            </button>
          </div>
        )}
        {report.status === "resolved" && report.action_taken === "정지" && (
          <div className="flex gap-4 justify-end mt-4 md:col-span-3">
            <button
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-500"
              onClick={() => setIsUnsuspendModalOpen(true)}
            >
              정지 해제
            </button>
          </div>
        )}
      </div>
      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrls={report.evidence}
        onClose={() => setIsModalOpen(false)}
      />
      {error && (
        <div className="fixed right-4 bottom-4 p-4 text-white bg-red-500 rounded-lg">
          {error}
        </div>
      )}
      <ReportProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        onSubmit={handleProcessReport}
        reportId={reportId}
        type="comment"
      />
      <ReportProcessModal
        isOpen={isUnsuspendModalOpen}
        onClose={() => setIsUnsuspendModalOpen(false)}
        onSubmit={handleUnsuspend}
        reportId={reportId}
        type="comment"
        isUnsuspend={true}
      />
    </div>
  );
};

export default ReportCommentsDetail;
