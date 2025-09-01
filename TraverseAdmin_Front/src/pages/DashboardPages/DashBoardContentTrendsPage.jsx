import { useEffect, useState } from "react";
import { dashboardAPI } from "../../utils/api";
import Header from "../../components/common/Header";
import DateRangePicker from "../../components/common/DateRangePicker";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Star, Hash } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-lg">
      {label && (
        <div className="mb-2 text-xs font-semibold text-gray-400">{label}</div>
      )}
      {payload.map((entry, idx) => (
        <div key={idx} className="flex gap-2 items-center mb-1 text-sm">
          {entry.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
          )}
          <span className="font-medium text-white">
            {entry.name}:{" "}
            <span className="font-bold">
              {entry.value?.toLocaleString?.() ?? entry.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

const DashBoardContentTrendsPage = () => {
  const [contentTrends, setContentTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return { start, end };
  });
  const [interval, setInterval] = useState("weekly");

  const handleDateRangeChange = (start, end) => {
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) setInterval("daily");
    else if (diffDays <= 60) setInterval("weekly");
    else setInterval("monthly");
    setDateRange({ start, end });
  };
  const handleIntervalChange = (e) => setInterval(e.target.value);

  useEffect(() => {
    setLoading(true);
    dashboardAPI
      .getContentTrends({
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
        interval,
      })
      .then((res) => {
        console.log("API 응답 확인", res); // 추가

        if (res?.data?.success && res.data.data) {
          setContentTrends(res.data.data); // data.data로 접근
        }
      })
      .finally(() => setLoading(false));
  }, [dateRange, interval]);

  return (
    <div className="overflow-auto relative z-10">
      <Header title="콘텐츠 활동 트렌드" />
      <main className="px-2 py-2 mx-auto max-w-7xl lg:px-4">
        <div className="flex flex-col justify-between items-center mb-4 md:flex-row">
          <div className="flex flex-col space-y-2 w-full md:flex-row md:space-y-0 md:space-x-4 md:w-auto">
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={handleDateRangeChange}
            />
            <select
              value={interval}
              onChange={handleIntervalChange}
              className="px-3 py-2 text-sm bg-gray-700 rounded-md border border-gray-600"
            >
              <option value="daily">일별</option>
              <option value="weekly">주별</option>
              <option value="monthly">월별</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            {/* 좌측 열: 트렌드 차트 */}
            <div className="flex flex-col space-y-6">
              {/* 게시물 생성 추이 */}
              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-100">
                  게시물 생성 추이
                </h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={contentTrends?.post_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tickFormatter={(value) =>
                          value.split("-").slice(0, 2).join("/")
                        }
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="게시물 수"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* 댓글 생성 추이 */}

              {/* 참여도(좋아요/댓글/공유) 추이 */}
              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-100">
                  참여도(좋아요/댓글/공유) 추이
                </h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={contentTrends?.engagement_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tickFormatter={(value) =>
                          value.split("-").slice(0, 2).join("/")
                        }
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        name="좋아요"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        name="댓글"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="shares"
                        name="공유"
                        stroke="#EC4899"
                        strokeWidth={2}
                        dot={{ fill: "#EC4899", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* 우측 열: 인기 콘텐츠 등 추가 가능 */}
            <div className="flex flex-col space-y-6">
              {/* 인기 게시물/해시태그 등 요약 정보 */}
              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg h-[398px]">
                <h2 className="mb-8 text-lg font-semibold text-gray-100">
                  인기 콘텐츠
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* 인기 게시물 */}
                  <div>
                    <h3 className="flex items-center mb-6 font-semibold text-purple-300 text-md">
                      <Star className="mr-1 text-purple-400" size={18} />
                      인기 게시물
                    </h3>
                    {contentTrends?.top_content?.posts?.length > 0 ? (
                      <ul className="space-y-4">
                        {contentTrends.top_content.posts
                          .slice(0, 3)
                          .map((post, idx) => (
                            <li
                              key={post.post_id}
                              className="flex items-center px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 shadow"
                            >
                              <span className="mr-3 text-xl font-bold text-purple-400">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <span className="font-medium text-gray-200">
                                  {post.title}
                                </span>
                                <span className="ml-2 text-xs text-gray-400">
                                  ({post.engagement} 참여)
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-400">데이터 없음</div>
                    )}
                  </div>
                  {/* 인기 해시태그 */}
                  <div>
                    <h3 className="flex items-center mb-6 font-semibold text-blue-300 text-md">
                      <Hash className="mr-1 text-blue-400" size={18} />
                      인기 해시태그
                    </h3>
                    {contentTrends?.top_content?.hashtags?.length > 0 ? (
                      <ul className="space-y-4">
                        {contentTrends.top_content.hashtags
                          .slice(0, 3)
                          .map((tag, idx) => (
                            <li
                              key={tag.id}
                              className="flex items-center px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 shadow"
                            >
                              <span className="mr-3 text-xl font-bold text-blue-400">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <span className="font-medium text-gray-200">
                                  {tag.name}
                                </span>
                                <span className="ml-2 text-xs text-gray-400">
                                  ({tag.usage_count}회 사용)
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-400">데이터 없음</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-100">
                  댓글 생성 추이
                </h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentTrends?.comment_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tickFormatter={(value) =>
                          value.split("-").slice(0, 2).join("/")
                        }
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="count" fill="#10B981" name="댓글 수" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default DashBoardContentTrendsPage;
