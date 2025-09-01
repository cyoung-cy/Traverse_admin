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

const searchFilterFn = (row, searchTerm) => {
  const searchLower = searchTerm.toLowerCase();
  return (
      (row.reporter_user_id &&
          row.reporter_user_id.toLowerCase().includes(searchLower)) ||
      (row.reported_user_name &&
          row.reported_user_name.toLowerCase().includes(searchLower)) ||
      (row.reason &&
          row.reason.toLowerCase().includes(searchLower)) ||
      (row.description &&
          row.description.toLowerCase().includes(searchLower)) ||
      (row.title &&
          row.title.toLowerCase().includes(searchLower)) ||
      (row.snap_title &&
          row.snap_title.toLowerCase().includes(searchLower))
  );
};


const fetchReports = async (params) => {
  const res = await reportsAPI.getReportsSnaps(params);
  if (res && res.data) {
    const { reports, total_count, limit } = res.data;
    const totalPages = limit > 0 ? Math.ceil(total_count / limit) : 1;

    return {
      reports: reports || [],
      total_pages: totalPages,
    };
  } else {
    return { reports: res.data.reports, total_pages: res.data.total_pages };
  }
};

const ReportSnapsTable = () => {
  const navigate = useNavigate();
  const columns = [
    { key: "report_id", label: "신고 ID" },
    {
      key: "title",
      label: "스냅",
      render: (row) => (
        <div>
          <div>{row.title}</div>
          <div className="text-sm text-gray-400">{row.snap_id}</div>
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
      onRowClick={(row) => navigate(`/report/snap/${row.report_id}`)}
      searchPlaceholder="신고 검색..."
      apiSearch={false}
      searchFilterFn={searchFilterFn}
    />
  );
};

export default ReportSnapsTable;
