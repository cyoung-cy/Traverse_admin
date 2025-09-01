import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { userAPI } from "../../utils/api";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import UsersTable from "../../components/users/UsersTable";

const UsersPage = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    churnRate: "0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const today = new Date();
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );

        const response = await userAPI.getUserStatistics({
          start_date: lastMonth.toISOString().split("T")[0],
          end_date: today.toISOString().split("T")[0],
          interval: "daily",
        });

        console.log("API Response:", response);
        console.log("API Response Data:", response.data);
        if (!response.data) {
          // if (!response.data || !response.data.success) {
          throw new Error("API request failed");
        }

        const stats = response.data;  // data.data가 아니라 data가 바로 stats임

        const total_users = Number(stats.total_users) || 0;

        // ✅ 오늘자 통계를 trend에서 추출
        const trend = stats.user_trend || [];
        const todayStats = trend.length > 0 ? trend[trend.length - 1] : null;

        const new_users = todayStats?.new_users || 0;
        const active_users = todayStats?.active_users || 0;

        if (typeof total_users !== "number" || isNaN(total_users)) {
          throw new Error("Invalid user statistics data");
        }

        setUserStats({
          totalUsers: total_users,
          newUsersToday: new_users,
          activeUsers: active_users,
          churnRate:
            total_users > 0
              ? (((total_users - active_users) / total_users) * 100).toFixed(
                  1
                ) + "%"
              : "0%",
        });
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
        setError(error.message || "Failed to fetch user statistics");
        setUserStats({
          totalUsers: 0,
          newUsersToday: 0,
          activeUsers: 0,
          churnRate: "0%",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (error) {
    return (
      <div className="overflow-auto relative z-10 flex-1">
        <Header title="Users" />
        <main className="px-2 py-4 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
          <div className="py-4 text-center text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="유저 조회" />

      <main className="px-6 py-4 mx-auto max-w-[1920px] lg:px-12">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 justify-items-center mx-auto mb-4 max-w-5xl sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="총 유저 수"
            icon={UsersIcon}
            value={isLoading ? "..." : userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="오늘 가입한 유저 수"
            icon={UserPlus}
            value={isLoading ? "..." : userStats.newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="활동 중인 유저 수"
            icon={UserCheck}
            value={isLoading ? "..." : userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="탈퇴한 유저 수"
            icon={UserX}
            value={isLoading ? "..." : userStats.churnRate}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable />
      </main>
    </div>
  );
};

export default UsersPage;
