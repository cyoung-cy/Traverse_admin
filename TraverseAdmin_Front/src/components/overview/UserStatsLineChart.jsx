import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DateRangePicker from "../common/DateRangePicker";
import { dashboardAPI } from "../../utils/api";

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
      <div className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-lg">
        <p className="mb-2 font-medium text-gray-300">{label}</p>
        {payload.map((entry, index) => (
            <div key={index} className="flex gap-2 items-center mb-1 text-sm">
              <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.stroke }}
              />
              <span className="font-medium text-white">
            {entry.name}:{" "}
                {entry.value !== null
                    ? entry.name === "리텐션율"
                        ? `${(entry.value * 100).toFixed(1)}%`
                        : entry.value.toLocaleString()
                    : "데이터 없음"}
          </span>
            </div>
        ))}
      </div>
  );
};

const UserStatsLineChart = () => {
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
        .getUserTrends({
          start_date: dateRange.start.toISOString().split("T")[0],
          end_date: dateRange.end.toISOString().split("T")[0],
          interval,
        })
        .then((res) => {
          if (res.data.success && res.data.data) {
            const signup = res.data.data.signup_trend || [];
            const active = res.data.data.active_trend || [];
            const retention = res.data.data.retention_trend || [];
            // 날짜 기준 병합
            const merged = signup.map((s, i) => ({
              date: s.date,
              signup: s.count,
              active: active[i]?.count ?? null,
              retention: retention[i]?.rate ?? null,
            }));
            setData(merged);
          }
          setLoading(false);
        });
  }, [dateRange, interval]);

  return (
      <div className="p-4 mb-4 bg-gray-800 rounded-lg shadow">
        <h2 className="mb-1 text-2xl font-bold text-white">회원 관련 지표</h2>
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
                className="p-2 bg-gray-700 text-white rounded-md"
            >
              <option value="daily">일간</option>
              <option value="weekly">주간</option>
              <option value="monthly">월간</option>
            </select>
          </div>
        </div>
        {loading ? (
            <p className="text-gray-400">로딩 중...</p>
        ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis yAxisId="left" stroke="#ccc" />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#ccc"
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="signup"
                    name="신규 가입자 수"
                    stroke="#4FD1C5"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="active"
                    name="활성 사용자 수"
                    stroke="#63B3ED"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="retention"
                    name="리텐션율"
                    stroke="#F6AD55"
                    strokeWidth={2}
                    dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
        )}
      </div>
  );
};

export default UserStatsLineChart;
