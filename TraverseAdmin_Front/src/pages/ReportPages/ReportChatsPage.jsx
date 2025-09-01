import { useState, useEffect } from "react";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import ChatReportsTable from "../../components/reports/ReportChatTable";
import { motion } from "framer-motion";
import { reportsAPI } from "../../utils/api";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

const ChatReportsPage = () => {
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
        console.log("Fetching chat reports stats");
        const response = await reportsAPI.getReportsChats({
          page: 1,
          limit: 1000,
          status: "all",
        });
        console.log("API Response:", response);

        const { data } = response;

        if (!data.success) {
          console.warn("API returned success: false");
          return;
        }

        const reports = data.reports || [];
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
          total: reports.length,
          pending,
          resolved,
          rejected,
          topReason,
        });
      } catch (error) {
        console.error("Error fetching chat report stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="채팅 신고 관리" />

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

        <ChatReportsTable />
      </main>
    </div>
  );
};

export default ChatReportsPage;
