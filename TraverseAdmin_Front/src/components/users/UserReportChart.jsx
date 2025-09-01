import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { userAPI } from "../../utils/api";
import DateRangePicker from "../common/DateRangePicker";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;

  return (
      <div className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-lg">
        <div className="flex gap-2 items-center text-sm">
          <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.fill }}
          />
          <span className="font-medium text-white">
          {data.category}: {data.count.toLocaleString()}건 ({data.percentage}%)
        </span>
        </div>
      </div>
  );
};

const UserReportChart = () => {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    new_users: 0,
    active_users: 0,
    user_trend: [],
    report_stats: {
      total: 0,
      pending: 0,
      resolved: 0,
      by_category: [],
    },
  });

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const calculateInterval = () => {
    const start = dateRange.start;
    const end = dateRange.end;
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const yearsDiff = daysDiff / 365;

    if (yearsDiff > 1) return "yearly";
    if (daysDiff <= 7) return "daily";
    if (daysDiff <= 31) return "weekly";
    return "monthly";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userAPI.getUserStatistics({
          start_date: dateRange.start.toISOString().split("T")[0],
          end_date: dateRange.end.toISOString().split("T")[0],
          interval: calculateInterval(),
        });
        console.log("📦 API 응답값:", response);            // 전체 응답 출력
        console.log("📊 통계 데이터:", response.data);
        if (response.data.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("신고 통계 데이터 조회 실패:", error);
      }
    };

    fetchData();
  }, [dateRange]);

  const reportData = statistics.report_stats.by_category.map((item, index) => ({
    ...item,
    percentage: ((item.count / statistics.report_stats.total) * 100).toFixed(1),
    fill: COLORS[index % COLORS.length],
  }));

  const calculateChartSize = () => {
    const start = dateRange.start;
    const end = dateRange.end;
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(300, (daysDiff / 30) * 300), 500);
  };

  return (
      <motion.div
          className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-opacity-60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="mb-1 text-2xl font-bold text-white">
                신고 카테고리 분포
              </h2>
            </div>
            <div className="flex gap-4">
              <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onChange={(start, end) => setDateRange({ start, end })}
              />
              <div className="px-4 py-2 h-10 bg-gray-700 rounded-lg w-fit">
                <span className="mr-2 text-gray-400">총 신고 건수:</span>
                <span className="font-semibold text-white">
                {statistics.report_stats.total}건
              </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="p-6 bg-gray-700 bg-opacity-50 rounded-xl transition-all duration-300 hover:bg-opacity-60">
            <div style={{ width: "100%", height: calculateChartSize() }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      outerRadius={calculateChartSize() / 3}
                      innerRadius={calculateChartSize() / 5}
                      dataKey="count"
                      nameKey="category"
                      label={({ category, percentage }) =>
                          `${category} ${percentage}%`
                      }
                  >
                    {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                      formatter={(value) => (
                          <span className="text-sm text-gray-300">{value}</span>
                      )}
                      wrapperStyle={{
                        paddingTop: "1rem",
                      }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex justify-between items-center p-4 bg-gray-700 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-opacity-70 hover:transform hover:scale-105">
              <div>
                <p className="mb-1 text-sm text-gray-400">처리 대기</p>
                <p className="text-xl font-bold text-white">
                  {statistics.report_stats.pending}
                  <span className="ml-2 text-sm text-gray-400">
                  (
                    {(
                        (statistics.report_stats.pending /
                            statistics.report_stats.total) *
                        100
                    ).toFixed(1)}
                    %)
                </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-opacity-70 hover:transform hover:scale-105">
              <div>
                <p className="mb-1 text-sm text-gray-400">처리 완료</p>
                <p className="text-xl font-bold text-white">
                  {statistics.report_stats.resolved}
                  <span className="ml-2 text-sm text-gray-400">
                  (
                    {(
                        (statistics.report_stats.resolved /
                            statistics.report_stats.total) *
                        100
                    ).toFixed(1)}
                    %)
                </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-opacity-70 hover:transform hover:scale-105">
              <div>
                <p className="mb-1 text-sm text-gray-400">주요 신고 사유</p>
                <p className="text-xl font-bold text-white">
                  {reportData.length > 0 ? reportData[0].category : "없음"}
                  {reportData.length > 0 && (
                      <span className="ml-2 text-sm text-gray-400">
                    ({reportData[0].percentage}%)
                  </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
};

export default UserReportChart;
