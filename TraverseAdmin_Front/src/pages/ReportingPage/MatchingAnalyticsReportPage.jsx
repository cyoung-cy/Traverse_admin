import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import {
  Users,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Award,
  MessageCircle,
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

const MatchingAnalyticsReportPage = () => {
  const { start, end } = getDefaultDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 폼 상태
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  // 데이터 불러오기 함수
  const fetchData = () => {
    setLoading(true);
    setError(null);
    reportsAnalyticsAPI
      .getMatchingAnalytics({
        start_date: startDate,
        end_date: endDate,
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
      <h1 className="mb-8 text-3xl font-bold text-center">매칭 분석 보고서</h1>
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
            <Users className="text-blue-400" size={22} /> 총 매칭 수
          </div>
          <div className="text-2xl font-bold text-blue-300">
            {data.overview.total_matches.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <CheckCircle className="text-green-400" size={22} /> 성공 매칭 수
          </div>
          <div className="text-2xl font-bold text-green-300">
            {data.overview.successful_matches.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <TrendingUp className="text-yellow-400" size={22} /> 성공률
          </div>
          <div className="text-2xl font-bold text-yellow-300">
            {data.overview.success_rate}%
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <Award className="text-pink-400" size={22} /> 평균 매칭 점수
          </div>
          <div className="text-2xl font-bold text-pink-300">
            {data.overview.avg_match_score}
          </div>
        </div>
      </div>

      {/* 매칭 품질/영향 */}
      <div className="grid grid-cols-1 gap-6 mx-auto mb-6 w-full max-w-3xl md:grid-cols-2">
        <div className={cardClass}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <BarChart2 className="text-indigo-400" size={20} /> 점수 분포
          </div>
          <ul className="space-y-1">
            {data.match_quality.score_distribution.map((s, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{s.range}</span>
                <span className="font-bold text-indigo-200">{s.count}건</span>
                <span className="text-xs text-indigo-400">
                  ({s.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <TrendingUp className="text-pink-400" size={20} /> 영향 요인
          </div>
          <ul className="space-y-1">
            {data.match_quality.factor_influence.map((f, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{f.factor}</span>
                <span className="font-bold text-pink-200">
                  {(f.influence * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 사용자 경험 */}
      <div className={cardClass + " max-w-2xl mx-auto mb-8"}>
        <div className="flex gap-2 items-center mb-2 font-semibold">
          <MessageCircle className="text-green-400" size={20} /> 사용자 경험
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            평균 매칭까지 소요 시간:{" "}
            <span className="font-bold text-green-300">
              {data.user_experience.avg_time_to_match}분
            </span>
          </div>
          <div>
            매칭당 평균 메시지:{" "}
            <span className="font-bold text-green-300">
              {data.user_experience.avg_messages_per_match}개
            </span>
          </div>
          <div>
            재매칭률:{" "}
            <span className="font-bold text-green-300">
              {(data.user_experience.rematch_rate * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            만족도 점수:{" "}
            <span className="font-bold text-green-300">
              {data.user_experience.satisfaction_score}
            </span>
          </div>
        </div>
      </div>

      {/* 트렌드 */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className={cardClass + " border-blue-400/30"}>
          <h3 className="mb-2 font-semibold text-blue-300">일별 매칭</h3>
          <ul className="space-y-1">
            {data.trends.matches_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-blue-200">{d.count}건</span>
                <span className="text-xs text-blue-400">
                  (성공 {d.success_count}건)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-yellow-400/30"}>
          <h3 className="mb-2 font-semibold text-yellow-300">일별 성공률</h3>
          <ul className="space-y-1">
            {data.trends.success_rate_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-yellow-200">{d.rate}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MatchingAnalyticsReportPage;
