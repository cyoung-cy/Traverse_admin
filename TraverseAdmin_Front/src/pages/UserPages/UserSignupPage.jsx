import Header from "../../components/common/Header";
import UserReportChart from "../../components/users/UserReportChart";
import UserGrowthChart from "../../components/users/UserGrowthChart";
import WithdrawalStatistics from "../../components/users/WithdrawalStatistics";
import UserSignupTable from "../../components/users/UserSignupTable";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { userAPI } from "../../utils/api";
import StatCard from "../../components/common/StatCard";

const UserSignupPage = () => {
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

        if (!response.success) {
          throw new Error("API request failed");
        }
        if (!response.data) {
          throw new Error("Invalid API response format: missing data");
        }

        const { total_users, new_users, active_users } = response.data;

        if (
          typeof total_users !== "number" ||
          typeof active_users !== "number"
        ) {
          throw new Error("Invalid user statistics data");
        }

        setUserStats({
          totalUsers: total_users,
          newUsersToday: new_users || 0,
          activeUsers: active_users,
          churnRate:
            total_users > 0
              ? (((total_users - active_users) / total_users) * 100).toFixed(
                  1
                ) + "%"
              : "0%",
        });
      } catch (error) {
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
        <Header title="유저 가입 관리" />
        <main className="px-2 py-4 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
          <div className="py-4 text-center text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="유저 가입 관리" />
      <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-3 mx-auto mb-6 max-w-5xl sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-5 lg:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="전체 유저 수"
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
            name="활성 유저 수"
            icon={UserCheck}
            value={isLoading ? "..." : userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="이탈률"
            icon={UserX}
            value={isLoading ? "..." : userStats.churnRate}
            color="#EF4444"
          />
        </motion.div>
        <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-2">
          <UserGrowthChart />
          <UserReportChart />
        </div>
        <WithdrawalStatistics />
      </main>
    </div>
  );
};

export default UserSignupPage;
