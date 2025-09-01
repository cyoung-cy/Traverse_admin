import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DateRangePicker from "../common/DateRangePicker";
import { dashboardAPI } from "../../utils/api";

const COLORS = ["#EF4444", "#F59E42", "#10B981"];

const ReportStatsPieChart = () => {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start, end };
  });
  const [interval, setInterval] = useState("monthly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDateRangeChange = (start, end) => {
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) setInterval("daily");
    else if (diffDays <= 60) setInterval("weekly");
    else setInterval("monthly");
    setDateRange({ start, end });
  };
  const handleIntervalChange = (e) => setInterval(e.target.value);

  useEffect(() => {
    console.log("🔥 useEffect 실행됨");
    setLoading(true);
    dashboardAPI
      .getMain({
        period:
          interval === "monthly"
            ? "month"
            : interval === "weekly"
            ? "week"
            : "day",
      })
      .then((res) => {
        console.log("API 응답:", res.data);

        if (res.data.success && res.data.data) {
          setData([
            { name: "전체 신고", value: res.data.data.report_stats?.total ?? 0 },
            { name: "미처리 신고", value: res.data.data.report_stats?.pending ?? 0 },
            { name: "처리 완료", value: res.data.data.report_stats?.resolved ?? 0 },
          ]);
        }
        setLoading(false);
      });
  }, [dateRange, interval]);

  return (
    <div className="p-4 mb-4 bg-gray-800 rounded-lg shadow">
      <div className="flex flex-col justify-between items-center mb-4 md:flex-row">
        <h3 className="mb-2 font-bold md:mb-0">신고 관련 지표</h3>
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
        <div className="flex justify-center items-center h-40 text-gray-400">
          로딩 중...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
export default ReportStatsPieChart;
