import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import { History, Download } from "lucide-react";

const cardClass =
  "bg-white/10 rounded-xl shadow-md p-6 flex flex-col gap-3 min-w-[220px] max-w-2xl mx-auto hover:shadow-lg transition border border-white/10";
const itemClass =
  "bg-white/5 rounded-lg p-4 mb-4 flex flex-col gap-1 border border-white/10 hover:bg-white/10 transition";

const ReportHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    reportsAnalyticsAPI
      .getReportHistory({ page: 1, page_size: 10 })
      .then((res) => setReports(res.data.reports))
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">보고서 히스토리</h1>
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
          <History className="text-blue-400" size={22} /> 보고서 히스토리
        </div>
        <ul>
          {reports.map((r) => (
            <li key={r.id} className={itemClass}>
              <div className="flex items-center gap-2 font-bold text-blue-200">
                <Download size={16} /> {r.name}
              </div>
              <div className="text-xs text-gray-400">유형: {r.type}</div>
              <div className="text-xs text-gray-400">
                생성일: {new Date(r.created_at).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                생성자: {r.created_by}
              </div>
              <a
                href={r.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold flex items-center gap-1 mt-1"
              >
                <Download size={14} /> 다운로드
              </a>
              <div className="text-xs text-gray-300">
                만료일: {new Date(r.expires_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportHistoryPage;
