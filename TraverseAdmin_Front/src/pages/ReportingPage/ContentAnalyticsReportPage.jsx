import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import {
  FileText,
  MessageCircle,
  Heart,
  BarChart2,
  Hash,
  TrendingUp,
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

const ContentAnalyticsReportPage = () => {
  const { start, end } = getDefaultDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 폼 상태
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [contentType, setContentType] = useState("all");

  // 데이터 불러오기 함수
  const fetchData = () => {
    setLoading(true);
    setError(null);
    reportsAnalyticsAPI
      .getContentAnalytics({
        start_date: startDate,
        end_date: endDate,
        content_type: contentType,
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
        콘텐츠 분석 보고서
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
          <label className="block mb-1 text-sm">분석 대상</label>
          <select
            className="px-2 py-1 text-white rounded border bg-white/10"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="posts">게시물</option>
            <option value="comments">댓글</option>
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
            <FileText className="text-blue-400" size={22} /> 총 게시물
          </div>
          <div className="text-2xl font-bold text-blue-300">
            {data.overview.total_posts.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <MessageCircle className="text-green-400" size={22} /> 총 댓글
          </div>
          <div className="text-2xl font-bold text-green-300">
            {data.overview.total_comments.toLocaleString()}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <Heart className="text-pink-400" size={22} /> 게시물당 평균 좋아요
          </div>
          <div className="text-2xl font-bold text-pink-300">
            {data.overview.avg_likes_per_post}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center text-lg font-semibold">
            <MessageCircle className="text-yellow-400" size={22} /> 게시물당
            평균 댓글
          </div>
          <div className="text-2xl font-bold text-yellow-300">
            {data.overview.avg_comments_per_post}
          </div>
        </div>
      </div>

      {/* 참여도 */}
      <div className="grid grid-cols-1 gap-6 mx-auto mb-6 w-full max-w-3xl md:grid-cols-2">
        <div className={cardClass}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <Heart className="text-pink-400" size={20} /> 가장 좋아요 많은
            게시물
          </div>
          <ul className="space-y-1">
            {data.engagement.most_liked_posts.map((p) => (
              <li key={p.post_id} className="flex justify-between">
                <span>{p.title}</span>
                <span className="font-bold text-pink-200">
                  {p.like_count}회
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <MessageCircle className="text-green-400" size={20} /> 가장 댓글
            많은 게시물
          </div>
          <ul className="space-y-1">
            {data.engagement.most_commented_posts.map((p) => (
              <li key={p.post_id} className="flex justify-between">
                <span>{p.title}</span>
                <span className="font-bold text-green-200">
                  {p.comment_count}개
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 시간대별 활동 */}
      <div className="mb-8">
        <div className={cardClass + " max-w-2xl mx-auto"}>
          <div className="flex gap-2 items-center mb-2 font-semibold">
            <BarChart2 className="text-indigo-400" size={20} /> 시간대별 활동
          </div>
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-gray-300">
                <th className="text-left">시간</th>
                <th>게시물 수</th>
                <th>좋아요 수</th>
                <th>댓글 수</th>
              </tr>
            </thead>
            <tbody>
              {data.engagement.engagement_by_time.map((row, idx) => (
                <tr key={idx} className="bg-white/5 hover:bg-white/10">
                  <td className="pl-2">{row.hour}시</td>
                  <td className="text-center">{row.post_count}</td>
                  <td className="text-center">{row.like_count}</td>
                  <td className="text-center">{row.comment_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 트렌드 */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className={cardClass + " border-blue-400/30"}>
          <h3 className="mb-2 font-semibold text-blue-300">일별 게시물</h3>
          <ul className="space-y-1">
            {data.content_trends.posts_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-blue-200">{d.count}개</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-green-400/30"}>
          <h3 className="mb-2 font-semibold text-green-300">일별 댓글</h3>
          <ul className="space-y-1">
            {data.content_trends.comments_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-green-200">{d.count}개</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cardClass + " border-pink-400/30"}>
          <h3 className="mb-2 font-semibold text-pink-300">일별 좋아요</h3>
          <ul className="space-y-1">
            {data.content_trends.likes_by_day.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span>{d.date}</span>
                <span className="font-bold text-pink-200">{d.count}회</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 인기 해시태그 */}
      <div className={cardClass + " max-w-2xl mx-auto"}>
        <div className="flex gap-2 items-center mb-2 font-semibold">
          <Hash className="text-yellow-400" size={20} /> 인기 해시태그
        </div>
        <ul className="flex flex-wrap gap-3 mt-2">
          {data.top_hashtags.map((h) => (
            <li
              key={h.name}
              className="flex gap-1 items-center px-3 py-1 text-sm font-semibold text-yellow-200 rounded bg-yellow-900/30"
            >
              <TrendingUp size={14} className="text-yellow-400" /> #{h.name}{" "}
              <span className="ml-1 text-xs">
                ({h.count}회, {h.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentAnalyticsReportPage;
