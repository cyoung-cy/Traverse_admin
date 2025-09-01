import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import PostReportsTable from "../../components/reports/ReportPostsTable";
import { reportsAPI } from "../../utils/api";

const PostReportPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
    topReason: { category: "없음", count: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportsAPI.getReportsPosts({
          page: 1,
          limit: 1000,
          status: "all",
        });
        console.log("API Response:", response);

        // response.data에 실제 데이터가 있음
        const { data } = response;

        if (!data.success) {
          console.warn("API returned success: false");
          return;
        }

        const reports = data.reports || [];
        const total_count = data.total_count || 0;

        const pending = reports.filter((r) => r.status === "pending").length;
        const resolved = reports.filter((r) => r.status === "resolved").length;
        const rejected = reports.filter((r) => r.status === "rejected").length;

        const reasonCounts = {};
        reports.forEach((report) => {
          const reason = report.reason || "없음";
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        });

        const topReason = Object.entries(reasonCounts).reduce(
          (max, [category, count]) =>
            count > max.count ? { category, count } : max,
          { category: "없음", count: 0 }
        );

        setStats({
          total: total_count,
          pending,
          resolved,
          rejected,
          topReason,
        });
      } catch (error) {
        console.error("Error fetching report stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="게시물 신고 관리" />

      <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
        <motion.div
          className="grid grid-cols-1 gap-5 justify-items-center mx-auto mb-8 max-w-5xl sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="전체 신고"
            icon={FileText}
            value={stats.total}
            color="#6366F1"
          />
          <StatCard
            name="대기중"
            icon={Clock}
            value={stats.pending}
            color="#F59E0B"
          />
          <StatCard
            name="해결됨"
            icon={CheckCircle}
            value={stats.resolved + stats.rejected}
            color="#10B981"
          />
          <StatCard
            name={`최다 사유: ${stats.topReason.category}`}
            icon={AlertTriangle}
            value={stats.topReason.count}
            color="#EF4444"
          />
        </motion.div>

        <PostReportsTable />
      </main>
    </div>
  );
};

export default PostReportPage;
