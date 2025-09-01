import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import ReportSnapsTable from "../../components/reports/ReportSnapsTable";
import { reportsAPI } from "../../utils/api";

const ReportSnapsPage = () => {
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
        const response = await reportsAPI.getReportsSnaps({
          page: 1,
          limit: 1000,
          status: "all",
        });

        console.log("Snap Report API Response:", response);

        if (response.data) {
          const data = response.data;

          const reports = data.reports || [];
          const total = data.total_count || 0;
          const pending = data.pending_count || 0;
          const resolved = data.resolved_count || 0;
          const rejected = data.other_count || 0;
          const topReasonCategory = data.top_reason || "없음";

          const topReasonCount = reports.filter(
              (r) => r.reason === topReasonCategory
          ).length;

          setStats({
            total,
            pending,
            resolved,
            rejected,
            topReason: {
              category: topReasonCategory,
              count: topReasonCount,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching snap report stats:", error);
      }
    };

    fetchStats();
  }, []);


  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="스냅 신고 관리" />
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
        <ReportSnapsTable />
      </main>
    </div>
  );
};

export default ReportSnapsPage;
