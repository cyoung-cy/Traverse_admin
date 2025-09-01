import {
  BarChart2,
  Menu,
  Settings,
  Siren,
  Users,
  ChevronDown,
  Bell,
  LayoutDashboard,
  FileText,
  MessageCircle,
  PieChart,
  Hash,
  HeartHandshake,
  ShieldCheck,
  NotebookPen,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "전체",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
  },
  {
    name: "유저",
    icon: Users,
    color: "#f87171",
    href: "/users",
    // { name: "유저 통계", href: "/users/signup" },
    // { name: "유저 등록 검토 어쩌구", href: "/users/withdrawal" },
  },
  // {
  //   name: "매칭",
  //   icon: HeartHandshake,
  //   color: "#f472b6",
  //   submenu: [
  //     { name: "매칭 알고리즘 설정", href: "/matching/settings" },
  //     { name: "매칭 통계", href: "/matching/statistics" },
  //     { name: "매칭 히스토리", href: "/matching/history" },
  //   ],
  // },
  {
    name: "게시물",
    icon: FileText,
    color: "#60a5fa",
    submenu: [
      { name: "게시물 목록", href: "/posts" },
      { name: "스냅 목록", href: "/snaps" },
      // { name: "게시물 검토 대기", href: "/posts/pending-reviews" },
    ],
  },
  {
    name: "신고",
    icon: Siren,
    color: "#ef4444",
    submenu: [
      { name: "유저 신고 관리", href: "/report/user" },
      { name: "게시물 신고 관리", href: "/report/post" },
      { name: "채팅 신고 관리", href: "/report/chat" },
      { name: "스냅 신고 관리", href: "/report/snap" },
      { name: "댓글 신고 관리", href: "/report/comment" },
    ],
  },
  {
    name: "알림",
    icon: Bell,
    color: "#34d399",
    href: "/notifications",
  },
  {
    name: "해시태그",
    icon: Hash,
    color: "#a78bfa",
    submenu: [
      { name: "해시태그 통계", href: "/hashtags/stats" },
      { name: "해시태그 목록", href: "/hashtags" },
      { name: "워드 클라우드", href: "/hashtags/wordcloud" },
    ],
  },
  {
    name: "채팅",
    icon: MessageCircle,
    color: "#facc15",
    href: "/chats/rooms",
  },
  // {
  //   name: "관리자",
  //   icon: ShieldCheck,
  //   color: "#38bdf8",
  //   submenu: [
  //     { name: "관리자 목록", href: "/admin/admins" },
  //     { name: "활동 로그", href: "/admin/activity-logs" },
  //   ],
  // },
  {
    name: "대시보드",
    icon: LayoutDashboard,
    color: "#fb7185",
    submenu: [
      { name: "유저 성장 트렌드", href: "/dashboard/user-trends" },
      { name: "콘텐츠 활동 트렌드", href: "/dashboard/content-trends" },
      // { name: "시스템 성능 모니터링", href: "/dashboard/system-performance" },
    ],
  },
  {
    name: "문의",
    icon: NotebookPen,
    color: "#fcd34d",
    href: "/inquiry/list",
  },
  // {
  //   name: "앱 설정",
  //   icon: Settings,
  //   color: "#4ade80",
  //   submenu: [
  //     { name: "기본 정보", href: "/settings/system/general" },
  //     { name: "금지어 관리", href: "/settings/system/banned-words" },
  //     { name: "API 키", href: "/settings/system/apikey" },
  //   ],
  // },
  // {
  //   name: "통계/보고서",
  //   icon: PieChart,
  //   color: "#f472b6",
  //   submenu: [
  //     { name: "사용자 분석", href: "/reporting/user-analytics" },
  //     { name: "콘텐츠 분석", href: "/reporting/content-analytics" },
  //     { name: "매칭 분석", href: "/reporting/matching-analytics" },
  //     { name: "모더레이션 활동", href: "/reporting/moderation-analytics" },
  //     { name: "커스텀 보고서", href: "/reporting/custom" },
  //     { name: "정기 보고서", href: "/reporting/scheduled" },
  //     { name: "보고서 히스토리", href: "/reporting/history" },
  //   ],
  // },
  { name: "내 정보", icon: UserRound, color: "#fca5a5", href: "/myinfo" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState([]);
  const location = useLocation();

  const submenuNames = SIDEBAR_ITEMS.filter((item) => item.submenu).map(
    (item) => item.name
  );
  const handleExpandAll = () => setOpenSubmenus(submenuNames);
  const handleCollapseAll = () => setOpenSubmenus([]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prev) => {
      if (prev.includes(menuName)) {
        return prev.filter((name) => name !== menuName);
      } else {
        return [...prev, menuName];
      }
    });
  };

  return (
    <motion.div
      className={`sticky top-0 h-screen z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-40" : "w-12"
      }`}
      animate={{ width: isSidebarOpen ? 160 : 48 }}
    >
      <div className="flex flex-col p-2 h-full bg-gray-800 bg-opacity-50 border-r border-gray-700 backdrop-blur-md select-none">
        <div className="flex gap-1 items-center mt-0 mb-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full transition-colors hover:bg-gray-700 max-w-fit"
          >
            <Menu size={24} />
          </motion.button>
          {isSidebarOpen && (
            <>
              <button
                className="text-[10px] px-1 py-1 rounded bg-gray-700 hover:bg-gray-600"
                onClick={handleExpandAll}
              >
                전체 열기
              </button>
              <button
                className="text-[10px] px-1 py-1 rounded bg-gray-700 hover:bg-gray-600"
                onClick={handleCollapseAll}
              >
                전체 닫기
              </button>
            </>
          )}
        </div>

        <nav className="overflow-y-auto flex-1 mt-3">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.href || item.name}>
              {item.submenu ? (
                <>
                  <motion.div
                    className={`flex items-center p-2 mb-1 text-sm font-medium rounded-lg transition-colors cursor-pointer hover:bg-gray-700 ${
                      item.submenu.some((subitem) => isActive(subitem.href))
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={() => {
                      if (isSidebarOpen) {
                        toggleSubmenu(item.name);
                      }
                    }}
                  >
                    {!isSidebarOpen ? (
                      <Link to={item.submenu[0].href}>
                        <item.icon
                          size={14}
                          style={{ color: item.color, minWidth: "20px" }}
                        />
                      </Link>
                    ) : (
                      <item.icon
                        size={14}
                        style={{ color: item.color, minWidth: "20px" }}
                      />
                    )}
                    {isSidebarOpen && (
                      <motion.span
                        className="flex justify-between items-center ml-4 w-full"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                      >
                        {item.name}
                        <ChevronDown
                          size={12}
                          className={`transform transition-transform ${
                            openSubmenus.includes(item.name) ? "rotate-180" : ""
                          }`}
                        />
                      </motion.span>
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {openSubmenus.includes(item.name) && isSidebarOpen && (
                      <motion.div
                        className="overflow-hidden ml-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.href} to={subitem.href}>
                            <motion.div
                              className={`flex items-center p-1 mb-1 text-[11px] rounded-lg transition-colors hover:bg-gray-700 ${
                                isActive(subitem.href) ? "bg-gray-700" : ""
                              }`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -10, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="ml-2 whitespace-nowrap">
                                {subitem.name}
                              </span>
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to={item.href}>
                  <motion.div
                    className={`flex items-center p-2 mb-1 text-sm font-medium rounded-lg transition-colors hover:bg-gray-700 ${
                      isActive(item.href) ? "bg-gray-700" : ""
                    }`}
                  >
                    <item.icon
                      size={14}
                      style={{ color: item.color, minWidth: "20px" }}
                    />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-2 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
export default Sidebar;
