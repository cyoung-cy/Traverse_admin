import {
  BarChart2,
  ShoppingBag,
  Users,
  Siren,
  Cpu,
  TrendingUp,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { dashboardAPI } from "../utils/api";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DashboardTrendsChart from "../components/overview/DashboardTrendsChart";
import UserReportChart from "../components/users/UserReportChart";
import UserStatsLineChart from "../components/overview/UserStatsLineChart";
import PostStatsStackedBarChart from "../components/overview/PostStatsStackedBarChart";

const MainPage = () => {
  const [mainStats, setMainStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getMain({ period: "month" });
        console.log("📊 [dashboard/main] 응답:", response);

        if (response.data?.success && response.data?.data) {
          setMainStats(response.data.data);
        }
      } catch (error) {
        console.error("데이터 fetch 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="메인 페이지" />
      <main className="px-2 py-4 mx-auto w-full lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="총 회원 수"
            icon={Users}
            value={
              loading
                ? "-"
                :mainStats?.total_users ?? "-"}

              color="#8B5CF6"
          />
          <StatCard
            name="신규 회원 수"
            icon={Users}
            value={mainStats?.user_stats?.newUsers ?? "-"}
            color="#6366F1"
          />
          <StatCard
            name="활성 회원 수"
            icon={Users}
            value={mainStats?.user_stats?.active ?? "-"}
            color="#10B981"
          />
          <StatCard
            name="게시물 수"
            icon={FileText}
            value={mainStats?.content_stats?.total_posts ?? "-"}
            color="#3B82F6"
          />
          <StatCard
            name="신규 게시물 수"
            icon={FileText}
            value={mainStats?.content_stats?.new_posts ?? "-"}
            color="#6366F1"
          />
          <StatCard
            name="전체 신고 수"
            icon={Siren}
            value={mainStats?.report_stats?.total ?? "-"}
            color="#EF4444"
          />
          <StatCard
              name="최근 신고 수"
              icon={Siren}
              value={mainStats?.recent_reports ?? "-"}
              color="#EC4899"
          />

          <StatCard
            name="미처리 신고 수"
            icon={Siren}
            value={mainStats?.report_stats?.pending ?? "-"}
            color="#F59E0B"
          />
          <StatCard
            name="회원 증가율"
            icon={TrendingUp}
            value={
              mainStats?.user_stats?.growth
                ? `${mainStats.user_stats.growth}%`
                : "-"
            }
            color="#F59E0B"
          />
          <StatCard
            name="전체 댓글 수"
            icon={FileText}
            value={mainStats?.content_stats?.comment_count ?? "-"}
            color="#EC4899"
          />
          <StatCard
            name="처리 완료 신고 수"
            icon={Siren}
            value={mainStats?.report_stats?.resolved ?? "-"}
            color="#10B981"
          />
          <StatCard
            name="활성 채팅방 수"
            icon={ShoppingBag}
            value={mainStats?.active_chat_rooms?? "-"}
            color="#3B82F6"
          />
        </motion.div>

        {/* 주요 지표 변화 추이 차트 */}
        <div className="grid gap-8 mb-12">
          <DashboardTrendsChart />
          <UserStatsLineChart />
        </div>

        {/* 카테고리별 막대차트 */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <PostStatsStackedBarChart />
          <UserReportChart />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
