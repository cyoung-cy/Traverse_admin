import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
            {entry.name}: {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const DashboardTrendsChart = () => {
  // 날짜 범위 및 interval 상태
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start, end };
  });
  const [interval, setInterval] = useState("daily");
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDateRangeChange = (start, end) => {
    // 날짜 차이에 따라 interval 자동 변경
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      setInterval("daily");
    } else if (diffDays <= 60) {
      setInterval("weekly");
    } else {
      setInterval("monthly");
    }
    setDateRange({ start, end });
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    dashboardAPI
      .getTrends({
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
        interval,
      })
      .then((response) => {
        if (response.data.success) {
          setTrendData(response.data.data.trends); // 수정 포인트
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("트렌드 데이터 로딩 실패:", error);
        setLoading(false);
      });
  }, [dateRange, interval]);

  return (
      <div className="p-4 mb-4 w-full h-80 bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col justify-between items-center mb-4 md:flex-row">
          <h3 className="mb-2 font-bold md:mb-0">주요 지표 변화 추이</h3>
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
            <div className="flex justify-center items-center h-64 text-gray-400">
              로딩 중...
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="75%">
              <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
                <YAxis stroke="#888" tick={{ fill: "#888" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="new_users"
                    name="신규 회원"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="new_posts"
                    name="신규 게시물"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="total_reports"
                    name="신고 수"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
        )}
      </div>
  );
};

export default DashboardTrendsChart;
