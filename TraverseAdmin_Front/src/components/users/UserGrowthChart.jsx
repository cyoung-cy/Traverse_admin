import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { userAPI } from "../../utils/api";
import DateRangePicker from "../common/DateRangePicker";

const UserGrowthChart = () => {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    new_users: 0,
    active_users: 0,
    user_trend: [],
  });

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [interval, setInterval] = useState("weekly");

  // 날짜 범위에 따른 데이터 간격 계산
  const calculateInterval = () => {
    const start = dateRange.start;
    const end = dateRange.end;
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) return "daily";
    if (daysDiff <= 90) return "weekly";
    return "monthly";
  };

  // 날짜 변경 시 interval 자동 변경
  const handleDateRangeChange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) setInterval("daily");
    else if (daysDiff <= 90) setInterval("weekly");
    else setInterval("monthly");
    setDateRange({ start: startDate, end: endDate });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userAPI.getUserStatistics({
          start_date: dateRange.start.toISOString().split("T")[0],
          end_date: dateRange.end.toISOString().split("T")[0],
          interval,
        });
        if (response.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("사용자 성장 데이터 조회 실패:", error);
      }
    };
    fetchData();
  }, [dateRange, interval]);

  // 날짜 범위에 따른 차트 너비 계산
  const calculateChartWidth = () => {
    const start = dateRange.start;
    const end = dateRange.end;
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    // 30일 기준으로 320px, 최소 320px, 최대 800px
    return Math.min(Math.max(320, (daysDiff / 30) * 320), 800);
  };

  return (
    <motion.div
      className="p-3 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md sm:p-4 md:p-5 lg:p-6 lg:col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex flex-col gap-4 mb-4 ml-4 sm:mb-6">
        <div className="flex flex-col gap-3 justify-between items-start sm:flex-row sm:items-center sm:gap-0">
          <h2 className="text-lg font-semibold text-gray-100 sm:text-xl">
            사용자 성장 추이
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={handleDateRangeChange}
          />
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="px-3 py-2 text-sm text-white bg-gray-700 rounded-md border border-gray-600"
            style={{ minWidth: 80 }}
          >
            <option value="daily">일별</option>
            <option value="weekly">주별</option>
            <option value="monthly">월별</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto items-center -mx-3 sm:-mx-4 md:-mx-5 lg:-mx-6">
        <div
          style={{
            height: "20vw",
            width: "90%",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statistics.user_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                interval="preserveStartEnd"
                tickFormatter={(value) => value.split("-").slice(1).join("/")}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} width={35} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                  fontSize: "12px",
                  padding: "8px",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="총 사용자"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="new_users"
                name="신규 사용자"
                stroke="#10B981"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="active_users"
                name="활성 사용자"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-12 text-xs sm:gap-4 sm:text-sm">
        <div className="flex items-center">
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#8B5CF6] mr-1 sm:mr-2"></div>
          <span className="text-gray-300">총 사용자</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#10B981] mr-1 sm:mr-2"></div>
          <span className="text-gray-300">신규 사용자</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#3B82F6] mr-1 sm:mr-2"></div>
          <span className="text-gray-300">활성 사용자</span>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-3 sm:gap-4 sm:mt-6">
        <div className="p-3 bg-gray-700 bg-opacity-50 rounded-lg sm:p-4">
          <p className="text-xs text-gray-400 sm:text-sm">총 사용자</p>
          <p className="text-lg font-bold text-white sm:text-2xl">
            {statistics.total_users.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-gray-700 bg-opacity-50 rounded-lg sm:p-4">
          <p className="text-xs text-gray-400 sm:text-sm">신규 사용자</p>
          <p className="text-lg font-bold text-white sm:text-2xl">
            {statistics.new_users.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-gray-700 bg-opacity-50 rounded-lg sm:p-4">
          <p className="text-xs text-gray-400 sm:text-sm">활성 사용자</p>
          <p className="text-lg font-bold text-white sm:text-2xl">
            {statistics.active_users.toLocaleString()}
          </p>
        </div>
      </div> */}
    </motion.div>
  );
};

export default UserGrowthChart;
