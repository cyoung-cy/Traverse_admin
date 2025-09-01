import { useEffect, useState } from "react";
import { dashboardAPI } from "../../utils/api";
import Header from "../../components/common/Header";
import DateRangePicker from "../../components/common/DateRangePicker";
import {
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

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

const DashBoardUserTrendsPage = () => {
  const [userTrends, setUserTrends] = useState(null);
  const [allUserDemographics, setAllUserDemographics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start, end };
  });
  const [interval, setInterval] = useState("weekly");
  const [showAllDemographics, setShowAllDemographics] = useState(false);

  const COLORS = [
    "#8B5CF6",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EC4899",
    "#6366F1",
  ];

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
    const params = {
      start_date: dateRange.start.toISOString().split("T")[0],
      end_date: dateRange.end.toISOString().split("T")[0],
      interval,
    };
    console.log("API 요청 파라미터:", params);
    dashboardAPI
      .getUserTrends(params)
      .then((res) => {
        console.log("API 응답 값:", res);
        if (res.data.success && res.data.data) {  // 여기 수정
          setUserTrends({
            signup_trend: res.data.data.signup_trend || [],
            active_trend: res.data.data.active_trend || [],
            retention_trend: res.data.data.retention_trend || [],
            user_demographics: res.data.data.user_demographics || {
              by_age: [],
              by_gender: [],
              by_location: [],
            },
          });
        } else {
          console.error("API 응답 데이터 형식이 올바르지 않습니다:", res);
        }
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      })
      .finally(() => setLoading(false));
  }, [dateRange, interval]);

  useEffect(() => {
    dashboardAPI
      .getUserTrends({
        start_date: "2000-01-01",
        end_date: "2100-12-31",
        interval: "monthly",
      })
      .then((res) => {
        if (res.data.success && res.data.data)  // 여기도 수정
          setAllUserDemographics(res.data.data.user_demographics);
      });
  }, []);

  // 연령대별 사용자 분포 데이터 변환
  const getAgeDistributionData = () => {
    const src = showAllDemographics
      ? allUserDemographics
      : userTrends?.user_demographics;
    if (!src?.by_age) return [];
    return src.by_age.map((item) => ({
      range: item.range,
      count: item.count,
      percentage: item.percentage,
    }));
  };

  // 성별 사용자 분포 데이터 변환
  const getGenderDistributionData = () => {
    const src = showAllDemographics
      ? allUserDemographics
      : userTrends?.user_demographics;
    if (!src?.by_gender) return [];
    return src.by_gender.map((item) => ({
      name: item.gender,
      value: item.count,
      percentage: item.percentage,
    }));
  };

  // 지역별 사용자 분포 데이터 변환
  const getLocationDistributionData = () => {
    const src = showAllDemographics
      ? allUserDemographics
      : userTrends?.user_demographics;
    if (!src?.by_location) return [];
    return src.by_location.map((item) => ({
      name: item.location,
      value: item.count,
      percentage: item.percentage,
    }));
  };

  return (
    <div className="overflow-auto relative z-10">
      <Header title="유저 성장 트렌드" />
      <main className="px-2 py-2 mx-auto max-w-7xl lg:px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">데이터를 불러오는 중...</div>
          </div>
        ) : !userTrends ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">데이터가 없습니다.</div>
          </div>
        ) : (
          <>
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
              <div className="flex justify-end items-center">
                <label className="mr-2 font-medium text-gray-200">
                  전체 통계
                </label>
                <input
                  type="checkbox"
                  checked={showAllDemographics}
                  onChange={(e) => setShowAllDemographics(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="ml-2 text-sm text-gray-400">
                  (연령/성별/지역 분포에만 적용)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
              {/* 좌측 열: 트렌드/리텐션/원본 데이터 */}
              <div className="flex flex-col space-y-6">
                {/* 월별 유저 성장 추이 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    신규 가입 추이
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userTrends?.signup_trend || []}>
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
                          name="신규 가입자"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 활성 사용자 추이 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    활성 사용자 추이
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userTrends?.active_trend || []}>
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
                          dataKey="count"
                          name="활성 사용자"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 리텐션 트렌드 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    사용자 리텐션 트렌드
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userTrends?.retention_trend || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="date"
                          stroke="#9CA3AF"
                          tickFormatter={(value) =>
                            value.split("-").slice(0, 2).join("/")
                          }
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          name="리텐션"
                          stroke="#6366F1"
                          strokeWidth={2}
                          dot={{ fill: "#6366F1", strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 원본 데이터
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 md:col-span-2">
                  <h3 className="mb-2 font-semibold text-gray-100 text-md">
                    원본 데이터
                  </h3>
                  <pre className="overflow-x-auto p-4 text-xs text-gray-400 bg-gray-800 rounded-lg">
                    {JSON.stringify(userTrends, null, 2)}
                  </pre>
                </div> */}
              </div>
              {/* 우측 열: 전체 통계 토글 + 연령/성별/지역 분포 */}
              <div className="flex flex-col space-y-6">
                {/* 연령대별 사용자 분포 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    연령대별 사용자 분포
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getAgeDistributionData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="range" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#8B5CF6" name="사용자 수">
                          {getAgeDistributionData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* 성별 사용자 분포 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    성별 사용자 분포
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getGenderDistributionData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {getGenderDistributionData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* 지역별 사용자 분포 */}
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-gray-100">
                    지역별 사용자 분포
                  </h2>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getLocationDistributionData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8B5CF6"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {getLocationDistributionData().map((entry, index) => (
                            <Cell
                              key={`cell-location-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
export default DashBoardUserTrendsPage;
