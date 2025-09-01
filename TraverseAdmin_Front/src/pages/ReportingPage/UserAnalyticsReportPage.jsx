import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import {
  User,
  Users,
  TrendingUp,
  Activity,
  PieChart,
  CalendarDays,
  Filter,
} from "lucide-react";

const cardClass =
  "bg-white/10 rounded-xl shadow-md p-5 flex flex-col gap-2 min-w-[180px] hover:shadow-lg transition border border-white/10";
const gridClass =
  "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full max-w-3xl mx-auto";

const METRICS = [
  { key: "signup", label: "가입" },
  { key: "retention", label: "리텐션" },
  { key: "engagement", label: "참여" },
];

const today = new Date();
const formatDate = (d) => d.toISOString().slice(0, 10);
const defaultStart = formatDate(
  new Date(today.getFullYear(), today.getMonth(), 1)
);
const defaultEnd = formatDate(today);

const UserAnalyticsReportPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 필터 상태
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [metrics, setMetrics] = useState(["signup", "retention", "engagement"]);

  // 조회 핸들러
  const fetchData = () => {
    setLoading(true);
    setError(null);
    setData(null);
    reportsAnalyticsAPI
      .getUserAnalytics({
        start_date: startDate,
        end_date: endDate,
        metrics: metrics.join(","),
      })
      .then((res) => setData(res.data))
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // metrics 체크박스 변경
  const handleMetricChange = (key) => {
    setMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="p-6 mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold text-center">
        사용자 분석 보고서
      </h1>
      {/* 필터 카드 */}
      <form
        className="flex flex-col gap-4 items-center p-5 mx-auto mb-8 max-w-3xl rounded-xl border shadow-md bg-white/10 md:flex-row border-white/10"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 items-center">
          <CalendarDays className="text-blue-400" size={18} />
          <input
            type="date"
            className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="mx-1">~</span>
          <input
            type="date"
            className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
            value={endDate}
            min={startDate}
            max={formatDate(today)}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-3 items-center">
          <Filter className="text-indigo-400" size={18} />
          {METRICS.map((m) => (
            <label key={m.key} className="flex gap-1 items-center text-sm">
              <input
                type="checkbox"
                checked={metrics.includes(m.key)}
                onChange={() => handleMetricChange(m.key)}
                className="accent-blue-500"
              />
              {m.label}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded transition hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </form>

      {loading && <div className="text-lg text-center">로딩 중...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && data && (
        <>
          {/* 주요 지표 카드 */}
          <div className={gridClass}>
            <div className={cardClass}>
              <div className="flex gap-2 items-center text-lg font-semibold">
                <Users className="text-blue-400" size={22} /> 총 사용자
              </div>
              <div className="text-2xl font-bold text-blue-300">
                {data.overview.total_users !== null &&
                data.overview.total_users !== undefined
                  ? data.overview.total_users.toLocaleString()
                  : "-"}
              </div>
            </div>
            <div className={cardClass}>
              <div className="flex gap-2 items-center text-lg font-semibold">
                <User className="text-green-400" size={22} /> 활성 사용자
              </div>
              <div className="text-2xl font-bold text-green-300">
                {data.overview.active_users !== null &&
                data.overview.active_users !== undefined
                  ? data.overview.active_users.toLocaleString()
                  : "-"}
              </div>
            </div>
            <div className={cardClass}>
              <div className="flex gap-2 items-center text-lg font-semibold">
                <TrendingUp className="text-yellow-400" size={22} /> 신규 사용자
              </div>
              <div className="text-2xl font-bold text-yellow-300">
                {data.overview.new_users !== null &&
                data.overview.new_users !== undefined
                  ? data.overview.new_users.toLocaleString()
                  : "-"}
              </div>
            </div>
            <div className={cardClass}>
              <div className="flex gap-2 items-center text-lg font-semibold">
                <Activity className="text-red-400" size={22} /> 이탈률
              </div>
              <div className="text-2xl font-bold text-red-300">
                {data.overview.churn_rate !== null &&
                data.overview.churn_rate !== undefined
                  ? `${data.overview.churn_rate}%`
                  : "-"}
              </div>
            </div>
          </div>

          {/* 리텐션/활동 */}
          <div className="grid grid-cols-1 gap-6 mx-auto mb-6 w-full max-w-3xl md:grid-cols-2">
            {data.retention && (
              <div className={cardClass}>
                <div className="flex gap-2 items-center mb-2 font-semibold">
                  <PieChart className="text-indigo-400" size={20} /> 리텐션
                </div>
                <div className="flex flex-col gap-1">
                  <span>
                    Day 1:{" "}
                    <span className="font-bold text-indigo-300">
                      {data.retention.day1}%
                    </span>
                  </span>
                  <span>
                    Day 7:{" "}
                    <span className="font-bold text-indigo-300">
                      {data.retention.day7}%
                    </span>
                  </span>
                  <span>
                    Day 30:{" "}
                    <span className="font-bold text-indigo-300">
                      {data.retention.day30}%
                    </span>
                  </span>
                </div>
              </div>
            )}
            {data.engagement && (
              <div className={cardClass}>
                <div className="flex gap-2 items-center mb-2 font-semibold">
                  <Activity className="text-pink-400" size={20} /> 활동/참여
                </div>
                <div className="flex flex-col gap-1">
                  <span>
                    DAU:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.dau}
                    </span>
                  </span>
                  <span>
                    WAU:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.wau}
                    </span>
                  </span>
                  <span>
                    MAU:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.mau}
                    </span>
                  </span>
                  <span>
                    DAU/WAU 비율:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.dau_wau_ratio}
                    </span>
                  </span>
                  <span>
                    유저당 세션:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.sessions_per_user}
                    </span>
                  </span>
                  <span>
                    평균 세션 시간:{" "}
                    <span className="font-bold text-pink-300">
                      {data.engagement.avg_session_duration}분
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 인구통계 */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-200">인구통계</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className={cardClass + " border-blue-400/30"}>
                <h3 className="mb-2 font-semibold text-blue-300">연령대</h3>
                <ul className="space-y-1">
                  {data.demographics.age_distribution.map((a) => (
                    <li key={a.range} className="flex justify-between">
                      <span>{a.range}</span>
                      <span className="font-bold text-blue-200">
                        {a.count}명
                      </span>
                      <span className="text-xs text-blue-400">
                        ({a.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cardClass + " border-green-400/30"}>
                <h3 className="mb-2 font-semibold text-green-300">성별</h3>
                <ul className="space-y-1">
                  {data.demographics.gender_distribution.map((g) => (
                    <li key={g.gender} className="flex justify-between">
                      <span>{g.gender}</span>
                      <span className="font-bold text-green-200">
                        {g.count}명
                      </span>
                      <span className="text-xs text-green-400">
                        ({g.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cardClass + " border-yellow-400/30"}>
                <h3 className="mb-2 font-semibold text-yellow-300">지역</h3>
                <ul className="space-y-1">
                  {data.demographics.location_distribution.map((l) => (
                    <li key={l.location} className="flex justify-between">
                      <span>{l.location}</span>
                      <span className="font-bold text-yellow-200">
                        {l.count}명
                      </span>
                      <span className="text-xs text-yellow-400">
                        ({l.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAnalyticsReportPage;
