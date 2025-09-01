import { useState, useEffect } from "react";
import { matchingAPI } from "../../utils/api";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import DateRangePicker from "../common/DateRangePicker";

const MatchingStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1); // 기본값: 지난 1개월
    return { start, end };
  });
  const [interval, setInterval] = useState("daily");

  // 통계 데이터 불러오기
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const params = {
          start_date: dateRange.start.toISOString().split("T")[0],
          end_date: dateRange.end.toISOString().split("T")[0],
          interval: interval,
        };

        const response = await matchingAPI.getMatchingStatistics(params);
        console.log("[매칭 통계 API 응답]", response);
        if (response.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("매칭 통계를 불러오는 중 오류가 발생했습니다:", error);
        toast.error("매칭 통계를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [dateRange, interval]);

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  // 트렌드 차트 데이터 생성
  const getMatchTrendChartData = () => {
    if (!statistics || !statistics.match_trend) return null;

    return statistics.match_trend.map((item) => ({
      date: item.date,
      전체매칭: item.count,
      성공매칭: item.success_count,
    }));
  };

  // 성공률 차트 데이터 생성
  const getSuccessRateChartData = () => {
    if (!statistics || !statistics.match_trend) return null;

    return statistics.match_trend.map((item) => ({
      date: item.date,
      성공률: item.success_rate,
    }));
  };

  // 위치 분포 차트 데이터
  const getLocationDistributionChartData = () => {
    if (
      !statistics ||
      !statistics.match_distribution_by_factors ||
      !statistics.match_distribution_by_factors.location
    )
      return null;

    return statistics.match_distribution_by_factors.location.map((item) => ({
      range: item.range,
      count: item.count,
    }));
  };

  // 관심사 분포 차트 데이터
  const getInterestsDistributionChartData = () => {
    if (
      !statistics ||
      !statistics.match_distribution_by_factors ||
      !statistics.match_distribution_by_factors.interests
    )
      return null;

    return statistics.match_distribution_by_factors.interests.map((item) => ({
      category: item.category,
      count: item.count,
    }));
  };

  // 연령대 분포 차트 데이터
  const getAgeDistributionChartData = () => {
    if (
      !statistics ||
      !statistics.match_distribution_by_factors ||
      !statistics.match_distribution_by_factors.age
    )
      return null;

    return statistics.match_distribution_by_factors.age.map((item) => ({
      range: item.range,
      count: item.count,
    }));
  };

  // 차트에 사용할 색상
  const COLORS = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  if (loading && !statistics) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
        <div className="flex justify-center items-center h-40">
          <div className="text-xl text-gray-400">
            통계 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
      <div className="flex flex-col justify-between items-center mb-6 md:flex-row">
        <h2 className="mb-4 text-xl font-semibold md:mb-0">매칭 통계</h2>
        <div className="flex flex-col space-y-3 w-full md:flex-row md:space-y-0 md:space-x-4 md:w-auto">
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

      {statistics && (
        <div className="space-y-8">
          {/* 통계 개요 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="mb-2 text-sm text-gray-400">총 매칭 수</h3>
              <p className="text-2xl font-bold">{statistics.total_matches}</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="mb-2 text-sm text-gray-400">성공한 매칭</h3>
              <p className="text-2xl font-bold">
                {statistics.successful_matches}
              </p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="mb-2 text-sm text-gray-400">성공률</h3>
              <p className="text-2xl font-bold">{statistics.success_rate}%</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="mb-2 text-sm text-gray-400">평균 매칭 점수</h3>
              <p className="text-2xl font-bold">
                {statistics.average_match_score}
              </p>
            </div>
          </div>

          {/* 매칭 트렌드 & 성공률 트렌드 차트 - 좌우 배치 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 매칭 트렌드 차트 */}
            <div>
              <h3 className="mb-3 text-lg font-medium">매칭 트렌드</h3>
              <div className="p-4 h-80 bg-gray-700 rounded-lg">
                {getMatchTrendChartData() && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getMatchTrendChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
                      <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="전체매칭"
                        stroke="rgba(75, 192, 192, 1)"
                        fill="rgba(75, 192, 192, 0.1)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="성공매칭"
                        stroke="rgba(54, 162, 235, 1)"
                        fill="rgba(54, 162, 235, 0.1)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            {/* 성공률 트렌드 차트 */}
            <div>
              <h3 className="mb-3 text-lg font-medium">성공률 트렌드</h3>
              <div className="p-4 h-80 bg-gray-700 rounded-lg">
                {getSuccessRateChartData() && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSuccessRateChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
                      <YAxis
                        domain={[0, 100]}
                        stroke="rgba(255, 255, 255, 0.7)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="성공률"
                        stroke="rgba(153, 102, 255, 1)"
                        fill="rgba(153, 102, 255, 0.1)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* 매칭 요소별 분포 */}
          <div>
            <h3 className="mb-3 text-lg font-medium">매칭 요소별 분포</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* 위치별 분포 */}
              <div className="p-4 h-80 bg-gray-700 rounded-lg">
                <h4 className="mb-3 text-sm font-medium text-center">
                  위치별 분포
                </h4>
                {getLocationDistributionChartData() && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getLocationDistributionChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis
                        dataKey="range"
                        stroke="rgba(255, 255, 255, 0.7)"
                      />
                      <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="위치별 매칭 분포">
                        {getLocationDistributionChartData().map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* 관심사별 분포 */}
              <div className="p-4 h-80 bg-gray-700 rounded-lg">
                <h4 className="mb-3 text-sm font-medium text-center">
                  관심사별 분포
                </h4>
                {getInterestsDistributionChartData() && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getInterestsDistributionChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis
                        dataKey="category"
                        stroke="rgba(255, 255, 255, 0.7)"
                      />
                      <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="관심사별 매칭 분포">
                        {getInterestsDistributionChartData().map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* 연령대별 분포 */}
              <div className="p-4 h-80 bg-gray-700 rounded-lg">
                <h4 className="mb-3 text-sm font-medium text-center">
                  연령대별 분포
                </h4>
                {getAgeDistributionChartData() && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getAgeDistributionChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis
                        dataKey="range"
                        stroke="rgba(255, 255, 255, 0.7)"
                      />
                      <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="연령대별 매칭 분포">
                        {getAgeDistributionChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingStatistics;
