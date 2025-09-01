import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { userAPI } from "../../utils/api";

const UserActivityHeatmap = () => {
  const [ageStats, setAgeStats] = useState([]);

  // useEffect(() => {
  //   const fetchAgeStats = async () => {
  //     const response = await userAPI.getUsers({ page: 1, limit: 100 });

  //     // 현재 연도
  //     const currentYear = new Date().getFullYear();

  //     // 연령대 그룹 초기화
  //     const ageGroups = {
  //       "10대": 0,
  //       "20대": 0,
  //       "30대": 0,
  //       "40대": 0,
  //       "50대": 0,
  //       "60대 이상": 0,
  //     };

  //     // 사용자 데이터를 기반으로 연령대 분류
  //     response.data.data.users.forEach((user) => {
  //       if (user.birthdate) {
  //         const birthYear = new Date(user.birthdate).getFullYear();
  //         const age = currentYear - birthYear;

  //         if (age < 20) ageGroups["10대"]++;
  //         else if (age < 30) ageGroups["20대"]++;
  //         else if (age < 40) ageGroups["30대"]++;
  //         else if (age < 50) ageGroups["40대"]++;
  //         else if (age < 60) ageGroups["50대"]++;
  //         else ageGroups["60대 이상"]++;
  //       }
  //     });

  //     // 차트에 사용할 데이터 변환
  //     const chartData = Object.entries(ageGroups).map(([range, count]) => ({
  //       range,
  //       count,
  //     }));

  //     setAgeStats(chartData);
  //   };

  //   fetchAgeStats();
  // }, []);

  return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-100">
        User Age Distribution
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={ageStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;
