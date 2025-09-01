import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import {
  Siren,
  CheckCircle,
  XCircle,
  Timer,
  User,
  BarChart2,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";

const cardClass =
  "bg-white/10 rounded-xl shadow-md p-5 flex flex-col gap-2 min-w-[180px] hover:shadow-lg transition border border-white/10";
const gridClass =
  "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full max-w-3xl mx-auto";

const getDefaultDateRange = () => {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() - 29);
  const start = startDateObj.toISOString().slice(0, 10);
  return { start, end };
};

const ModerationAnalyticsReportPage = () => {
  const { start, end } = getDefaultDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 폼 상태
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [type, setType] = useState("all");

  // 데이터 불러오기 함수
  const fetchData = () => {
    setLoading(true);
    setError(null);
    reportsAnalyticsAPI
      .getModerationAnalytics({
        start_date: startDate,
        end_date: endDate,
        type: type,
      })
      .then((res) => setData(res.data))
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold text-center">
        모더레이션 활동 보고서
      </h1>
      {/* 검색 폼 */}
      <form
        className="flex flex-wrap gap-4 justify-center items-end mb-8"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block mb-1 text-sm">시작일</label>
          <input
            type="date"
            className="px-2 py-1 text-white rounded border bg-white/10"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={end}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">종료일</label>
          <input
            type="date"
            className="px-2 py-1 text-white rounded border bg-white/10"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={end}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">신고 유형</label>
          <select
            className="px-2 py-1 text-white rounded border bg-white/10"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="user">사용자</option>
            <option value="post">게시물</option>
            <option value="chat">채팅</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded shadow hover:bg-blue-600"
        >
          조회
        </button>
      </form>
      {/* 주요 지표 카드 */}
      <div className={gridClass}>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <Siren className="text-red-400" size={22} /> 총 신고 수
          </div>
          <div className="text-2xl font-bold text-red-300">
            {data.overview.total_reports.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <CheckCircle className="text-green-400" size={22} /> 처리된 신고
          </div>
          <div className="text-2xl font-bold text-green-300">
            {data.overview.resolved_reports.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <XCircle className="text-yellow-400" size={22} /> 거부된 신고
          </div>
          <div className="text-2xl font-bold text-yellow-300">
            {data.overview.rejected_reports.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <Timer className="text-blue-400" size={22} /> 평균 처리 시간
          </div>
          <div className="text-2xl font-bold text-blue-300">
            {data.overview.avg_resolution_time}시간
          </div>
        </div>
      </div>

      {/* 유형/사유/조치/관리자 */}
      <div className="grid grid-cols-1 gap-6 mx-auto mb-6 w-full max-w-3xl md:grid-cols-2">
        <div className={cardClass + " border-red-400/30"}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <BarChart2 className="text-red-400" size={20} /> 신고 유형별
          </div>
          <ul className="space-y-1">
            {data.reports_by_type.map((t, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{t.type}</span>
                <span className="font-bold text-red-200">{t.count}건</span>
                <span className="text-xs text-red-400">({t.percentage}%)</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-yellow-400/30"}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <Activity className="text-yellow-400" size={20} /> 신고 사유별
          </div>
          <ul className="space-y-1">
            {data.reports_by_reason.map((r, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{r.reason}</span>
                <span className="font-bold text-yellow-200">{r.count}건</span>
                <span className="text-xs text-yellow-400">
                  ({r.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-green-400/30"}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <CheckCircle className="text-green-400" size={20} /> 조치 내역
          </div>
          <ul className="space-y-1">
            {data.actions_taken.map((a, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{a.action}</span>
                <span className="font-bold text-green-200">{a.count}건</span>
                <span className="text-xs text-green-400">
                  ({a.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-blue-400/30"}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <User className="text-blue-400" size={20} /> 관리자별 처리
          </div>
          <ul className="space-y-1">
            {data.admin_activity.map((a, idx) => (
              <li key={a.admin_id} className="flex justify-between">
                <span>{a.admin_name}</span>
                <span className="font-bold text-blue-200">
                  {a.reports_processed}건
                </span>
                <span className="text-xs text-blue-400">
                  (평균 {a.avg_resolution_time}시간)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 트렌드 */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className={cardClass + " border-pink-400/30"}>
          <h3 className="mb-2 font-semibold text-pink-300">일별 신고</h3>
          <ul className="space-y-1">
            {data.trends.reports_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-pink-200">{d.count}건</span>
                <span className="text-xs text-pink-400">
                  (처리 {d.resolved_count}건)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-indigo-400/30"}>
          <h3 className="mb-2 font-semibold text-indigo-300">일별 처리 시간</h3>
          <ul className="space-y-1">
            {data.trends.resolution_time_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-indigo-200">
                  {d.avg_time}시간
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModerationAnalyticsReportPage;
