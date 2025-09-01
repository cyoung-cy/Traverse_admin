import { useNavigate } from "react-router-dom";
import { reportsAPI } from "../../utils/api";
import ReportTableBase from "./common/ReportTableBase";

const getStatusColor = (status) => {
  let statusValue = status || "pending";
  return statusValue === "pending"
    ? "bg-yellow-700 text-yellow-100"
    : statusValue === "resolved"
    ? "bg-green-700 text-green-100"
    : statusValue === "rejected"
    ? "bg-red-700 text-red-100"
    : "bg-gray-700 text-gray-200";
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

// fetchReports 래핑: mock/실제 API 모두 지원
const fetchReports = async (params) => {
  const res = await reportsAPI.getReportsUsers(params);
  if (res.data) {
    return {
      reports: res.data.reports,
      total_pages: res.data.total_pages,
    };
  } else if (res.reports) {
    return {
      reports: res.reports,
      total_pages: res.total_pages,
    };
  }
  return { reports: [], total_pages: 1 };
};

const ReportUsersTable = () => {
  const navigate = useNavigate();
  const columns = [
    { key: "report_id", label: "신고 ID" },
    {
      key: "reported_user_name",
      label: "신고 대상",
      render: (row) => (
        <div>
          <div>{row.reported_user_name}</div>
          <div className="text-sm text-gray-400">{row.reported_user_id}</div>
        </div>
      ),
    },
    { key: "reporter_user_id", label: "신고자" },
    {
      key: "reason",
      label: "사유",
      render: (row) => (
        <div>
          <div>{row.reason}</div>
          <div className="text-sm text-gray-400">{row.description}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (row) => (
        <span
          className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
            row.status
          )}`}
        >
          {getStatusText(row.status)}
        </span>
      ),
    },
    // { key: "severity", label: "심각도" },
    {
      key: "created_at",
      label: "신고일",
      sortable: true,
      render: (row) => formatDate(row.created_at),
    },
  ];
  return (
    <ReportTableBase
      columns={columns}
      fetchReports={fetchReports}
      onRowClick={(row) => navigate(`/report/user/${row.report_id}`)}
      searchPlaceholder="신고 검색..."
      apiSearch={true}
    />
  );
};

export default ReportUsersTable;
