import { useEffect, useState } from "react";
import { dashboardAPI } from "../../utils/api";
import Header from "../../components/common/Header";
import {
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import DateRangePicker from "../../components/common/DateRangePicker";

const COLORS = [
  "#8B5CF6",
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
];

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

const DashBoardSystemPerformancePage = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start, end };
  });
  const [interval, setInterval] = useState("weekly");
  const [error, setError] = useState(null);

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
    setError(null);
    dashboardAPI
      .getSystemPerformance({
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
        interval,
      })
      .then((res) => {
        const data = res.success ? res : res.data;
        if (data.success) {
          setSystemData(data.data);
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      })
      .catch((e) => setError("에러 발생: " + e.message))
      .finally(() => setLoading(false));
  }, [dateRange, interval]);

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="시스템 성능 모니터링" />
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
          <div className="py-10 text-center text-gray-300">로딩 중...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-400">{error}</div>
        ) : systemData ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* API 요청 수 및 평균 응답 시간 */}
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-100">
                API 요청 수 및 평균 응답 시간
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={systemData.api_requests.map((item) => ({
                      name: item.timestamp.split("T")[0],
                      requests: item.count,
                      response: item.avg_response_time,
                    }))}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="requests"
                      name="요청 수"
                      fill="#3B82F6"
                      barSize={24}
                    />
                    <Line
                      type="monotone"
                      dataKey="response"
                      name="평균 응답(ms)"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: "#F59E0B", r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* 에러 트렌드 및 유형 차트 */}

            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-100">
                시간별 에러 수 추이
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={systemData.errors.map((item) => ({
                      name: item.timestamp.split("T")[0],
                      errors: item.count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      name="에러 수"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-100">
                상위 에러 유형 분포
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        systemData.errors[0]?.top_errors?.map((e) => ({
                          name: e.type,
                          value: e.count,
                        })) || []
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {(systemData.errors[0]?.top_errors || []).map(
                        (entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* 자원 사용률 차트 */}
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg md:col-span-3">
              <h3 className="mb-4 text-lg font-semibold text-gray-100">
                자원 사용률 (CPU/Memory/Disk)
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={systemData.resource_usage.cpu.map((item, idx) => ({
                      time: item.timestamp.split("T")[0],
                      cpu: item.usage,
                      memory: systemData.resource_usage.memory[idx]?.usage,
                      disk: systemData.resource_usage.disk[idx]?.usage,
                    }))}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cpu"
                      name="CPU"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="memory"
                      name="Memory"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="disk"
                      name="Disk"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-300">
            데이터가 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};
export default DashBoardSystemPerformancePage;
