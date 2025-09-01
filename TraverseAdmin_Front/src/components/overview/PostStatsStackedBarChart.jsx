import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import DateRangePicker from "../common/DateRangePicker";
import { dashboardAPI } from "../../utils/api";

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-lg">
      <p className="mb-1 font-medium text-gray-300">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex gap-2 items-center text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="font-medium text-white">
            {entry.name}: {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const PostStatsStackedBarChart = () => {
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
      .getContentTrends({
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
        interval,
      })
      .then((res) => {
        if (res.data.success && res.data.data) {
          // 날짜별 게시물, 댓글 데이터로 변환
          const post = res.data.data.post_trend || [];
          const comment = res.data.data.comment_trend || [];
          // 날짜 기준으로 병합
          const merged = post.map((p, i) => ({
            date: p.date,
            post: p.count,
            comment: comment[i]?.count ?? null,
          }));
          setData(merged);
        }
        setLoading(false);
      });
  }, [dateRange, interval]);

  return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-opacity-60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="mb-1 text-2xl font-bold text-white">게시물 관련 지표</h3>
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
        <ResponsiveContainer width="90%" height={480}>
          <BarChart data={data} stackOffset="sign">
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="post" name="게시물" stackId="a" fill="#3B82F6" />
            <Bar dataKey="comment" name="댓글" stackId="a" fill="#1ced38" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};
export default PostStatsStackedBarChart;
