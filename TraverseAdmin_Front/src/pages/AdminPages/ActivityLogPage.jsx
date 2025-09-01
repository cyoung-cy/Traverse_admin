import React, { useState, useEffect } from "react";
import ActivityLogView from "../../components/admin/ActivityLogView";
import { adminAPI } from "../../utils/api";
import { BarChart3 } from "lucide-react";

// 테마 색상 정의 (Tailwind에서 사용할 수 없는 색상이 필요한 경우)
const colors = {
  primary: "#141b2d",
  secondary: "#4cceac",
  accent: "#6870fa",
  background: "#111827",
  blueAccent: {
    700: "#3e4396",
  },
  greenAccent: {
    300: "#94e2cd",
  },
};

const Header = ({ title, subtitle }) => {
  return (
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <BarChart3 size={24} className="text-indigo-400" />
          <h1 className="m-0 text-2xl font-semibold text-gray-100">{title}</h1>
        </div>
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      </div>
  );
};

const ActivityLogPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    admin_id: null,
    action_type: null,
    start_date: null,
    end_date: null,
  });

  const fetchLogs = async (page = 1, filterOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const requestParams = {
        page,
        limit: 15,
        ...filterOptions,
      };

      console.log("활동 로그 API 요청 옵션:", requestParams);

      const response = await adminAPI.getActivityLog(requestParams);

      console.log("활동 로그 API 응답:", response);


      if (response.data.success) {
        setLogs(response.data.data.logs);
        setTotalCount(response.data.data.total_count);
        setPageCount(response.data.data.total_pages);
        setCurrentPage(response.data.data.current_page);
      } else {
        setError(response.error || "활동 로그를 불러오는데 실패했습니다");
      }
    } catch (err) {
      console.error("활동 로그 API 오류:", err);
      setError(err.message || "활동 로그를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  return (
      <div className="p-5 min-h-screen text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex justify-between items-center mb-5">
          <Header title="활동 로그" subtitle="관리자 활동 기록" />
        </div>

        <div className="mt-10">
          <ActivityLogView
              logs={logs}
              loading={loading}
              error={error}
              totalCount={totalCount}
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
              filters={filters}
              colors={colors}
          />
        </div>
      </div>
  );
};

export default ActivityLogPage;
