import { useState, useEffect } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DateRangePicker from "../common/DateRangePicker";
import { dashboardAPI } from "../../utils/api";

const COLORS = ["#10B981", "#F59E42", "#3B82F6"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-lg">
      {payload.map((entry, index) => (
        <div key={index} className="flex gap-2 items-center mb-1 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.payload.fill }}
          />
          <span className="font-medium text-white">
            {entry.payload.name}: {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const MatchingStatsRadialBarChart = () => {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start, end };
  });
  const [interval, setInterval] = useState("daily");
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
        if (res.success && res.data) {
          setData([
            {
              name: "전체 매칭",
              value: res.data.matching_stats?.total_matches ?? 0,
              fill: COLORS[0],
            },
            {
              name: "매칭 성공률(%)",
              value: res.data.matching_stats?.success_rate ?? 0,
              fill: COLORS[1],
            },
            {
              name: "활성 채팅방",
              value: res.data.matching_stats?.active_chats ?? 0,
              fill: COLORS[2],
            },
          ]);
        }
        setLoading(false);
      });
  }, [dateRange, interval]);

  return (
    <div className="p-4 mb-4 bg-gray-800 rounded-lg shadow">
      <h3 className="mb-1 text-2xl font-bold text-white">
        매칭/채팅 관련 지표
      </h3>
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
        <div className="flex justify-center items-center h-40 text-gray-400">
          로딩 중...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            barSize={18}
            data={data}
          >
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff" }}
              background={{ fill: "#333" }}
              clockWise
              dataKey="value"
              nameKey="name"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
export default MatchingStatsRadialBarChart;
