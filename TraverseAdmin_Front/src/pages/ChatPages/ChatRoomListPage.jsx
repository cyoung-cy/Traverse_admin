import React, { useState, useEffect } from "react";
import { chatAPI } from "../../utils/api";
import {
  MessageCircle,
  Users,
  MessageSquare,
  FlagTriangleRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import ChatRoomTable from "../../components/ChatRooms/ChatRoomTable";

const ChatRoomListPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    blocked: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChatRooms({
        page: 1,
        limit: 1000,
        status: "all", // 백엔드에 맞게 status 파라미터 전달
      });

      console.log("API 응답 데이터:", response.data);

      if (response && response.data && response.data.success) {
        const rooms = response.data.data.rooms || [];
        const totalCount = response.data.data.total_count || 0;

        const active = rooms.filter((room) => room.status === "active").length;
        const archived = rooms.filter(
          (room) => room.status === "archived"
        ).length;
        const blocked = rooms.filter(
          (room) => room.status === "blocked"
        ).length;

        setStats({
          total: totalCount,
          active,
          archived,
          blocked,
        });
      }
    } catch (error) {
      console.error("채팅방 통계 조회 실패:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="채팅방 관리" />

      <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
        <motion.div
          className="grid grid-cols-1 gap-5 justify-items-center mx-auto mb-8 max-w-5xl sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="전체 채팅방"
            icon={MessageCircle}
            value={stats.total}
            color="#6366F1"
          />
          <StatCard
            name="활성 채팅방"
            icon={Users}
            value={stats.active}
            color="#10B981"
          />
          <StatCard
            name="보관된 채팅방"
            icon={MessageSquare}
            value={stats.archived}
            color="#F59E0B"
          />
          <StatCard
            name="차단된 채팅방"
            icon={FlagTriangleRight}
            value={stats.blocked}
            color="#EF4444"
          />
        </motion.div>

        <ChatRoomTable />
      </main>
    </div>
  );
};

export default ChatRoomListPage;
