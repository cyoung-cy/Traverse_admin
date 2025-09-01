import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { userAPI } from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";
import DateRangePicker from "../common/DateRangePicker";

const cardClass =
  "bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 flex flex-col gap-2";
const chartTitleClass =
  "text-base font-semibold mb-2 text-gray-800 dark:text-gray-100";
const summaryItemClass = "flex-1 flex flex-col items-center";

const WithdrawalStatistics = () => {
  const [statistics, setStatistics] = useState({
    total: 0,
    by_reason: [],
    trend: [],
  });

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [interval, setInterval] = useState("weekly");

  // 날짜 범위에 따른 데이터 간격 계산
  const calculateInterval = () => {
    const start = dateRange.start;
    const end = dateRange.end;
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return "daily";
    if (daysDiff <= 31) return "weekly";
    return "monthly";
  };

  // 날짜 변경 시 interval 자동 변경
  const handleDateRangeChange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) setInterval("daily");
    else if (daysDiff <= 31) setInterval("weekly");
    else setInterval("monthly");
    setDateRange({ start: startDate, end: endDate });
  };

  const fetchStatistics = async () => {
    try {
      const start_date = dateRange.start.toISOString().split("T")[0];
      const end_date = dateRange.end.toISOString().split("T")[0];
      const response = await userAPI.getWithdrawalReasons({
        start_date,
        end_date,
        interval,
      });
      if (response.success) setStatistics(response.data);
    } catch (error) {
      console.error("탈퇴 통계 데이터 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange, interval]);

  // ComposedChart용 데이터 변환
  const getComposedData = () => {
    const { trend, by_reason } = statistics;
    if (!trend.length || !by_reason.length) return [];
    // 사유별 key 배열
    const reasonKeys = by_reason.map((r) => r.reason);
    const reasonPercentages = by_reason.map((r) => r.percentage);
    return trend.map((t) => {
      const obj = { date: t.date, total: t.count };
      let remain = t.count;
      // 각 사유별로 비율에 따라 분배 (마지막 사유는 남은 값 할당)
      reasonKeys.forEach((reason, idx) => {
        let val;
        if (idx === reasonKeys.length - 1) {
          val = remain;
        } else {
          val = Math.round(t.count * (reasonPercentages[idx] / 100));
          remain -= val;
        }
        obj[reason] = val;
      });
      return obj;
    });
  };
  const composedData = getComposedData();
  const barColors = [
    "#6366f1",
    "#60a5fa",
    "#f59e42",
    "#f87171",
    "#34d399",
    "#a78bfa",
  ];
  // interval에 따라 barSize 동적 설정
  const getBarSize = () => {
    if (interval === "daily") return 20;
    if (interval === "weekly") return 40;
    if (interval === "monthly") return 60;
    return 20;
  };
  const barSize = getBarSize();

  return (
    <motion.div
      className="col-span-2 px-20 py-10 mb-12 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          탈퇴 사유 통계
        </h2>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={handleDateRangeChange}
        />
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="px-3 py-2 ml-2 text-sm text-white bg-gray-700 rounded-md border border-gray-600"
          style={{ minWidth: 80 }}
        >
          <option value="daily">일별</option>
          <option value="weekly">주별</option>
          <option value="monthly">월별</option>
        </select>
      </div>
      {/* ComposedChart로 통합 */}
      <div className={cardClass}>
        <div className={chartTitleClass}>일별 탈퇴 사유 + 전체 추이</div>
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart data={composedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", color: "#222" }}
            />
            <Legend />
            {/* 사유별 Bar */}
            {statistics.by_reason.map((r, idx) => (
              <Bar
                key={r.reason}
                dataKey={r.reason}
                name={r.reason}
                stackId="a"
                fill={barColors[idx % barColors.length]}
                barSize={barSize}
                barCategoryGap="40%"
              />
            ))}
            {/* 전체 탈퇴 건수 Line */}
            <Line
              type="monotone"
              dataKey="total"
              name="총 탈퇴 건수"
              stroke="#86ff40"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* 요약 통계
      <div className={`flex-row gap-4 mt-4 ${cardClass}`}>
        <div className={summaryItemClass}>
          <span className="text-sm text-gray-500">총 탈퇴 건수</span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {statistics.total}
          </span>
        </div>
        <div className={summaryItemClass}>
          <span className="text-sm text-gray-500">주요 탈퇴 사유</span>
          <span className="text-xl font-bold">
            {statistics.by_reason[0]?.reason || "없음"}
            {statistics.by_reason[0] && (
              <span className="ml-1 text-sm text-gray-400">
                ({statistics.by_reason[0].percentage}%)
              </span>
            )}
          </span>
        </div>
      </div> */}
    </motion.div>
  );
};

export default WithdrawalStatistics;
