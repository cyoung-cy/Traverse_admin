import React, { useState, useEffect } from "react";
import AdminListView from "../../components/admin/AdminListView";
import { adminAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";

// 테마 색상 정의
const colors = {
  primary: "#141b2d",
  secondary: "#4cceac",
  accent: "#6870fa",
  greenAccent: {
    300: "#94e2cd",
  },
  blueAccent: {
    700: "#3e4396",
  },
};

const AdminListPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchAdmins = async (page = 1, search = "", role = "all") => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.getAdmins({
        page,
        limit: 10,
        search,
        role,
      });

      console.log("관리자 목록 API 응답:", response);

      // 데이터 구조가 배열인지 확인 후 설정
      if (Array.isArray(response.data.admins)) {
        setAdmins(response.data.admins);
        setTotalCount(response.data.total_count);
        setPageCount(response.data.total_pages);
        setCurrentPage(response.data.current_page);
      } else {
        throw new Error("잘못된 응답 형식입니다.");
      }
    } catch (err) {
      console.error("관리자 목록 API 오류:", err);
      setError(err.message || "관리자 목록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  //    if (response.data.success) {
  //      setAdmins(response.data.admins);
  //      setTotalCount(response.data.total_count);
  //      setPageCount(response.data.total_pages);
  //       setCurrentPage(response.data.current_page);
  //     } else {
  //       setError(response.error || "관리자 목록을 불러오는데 실패했습니다");
  //    }
  //  } catch (err) {
  //     console.error("관리자 목록 API 오류:", err);
  //     setError(err.message || "관리자 목록을 불러오는데 실패했습니다");
  //   } finally {
  //     setLoading(false);
  //  }
  // };

  useEffect(() => {
    fetchAdmins(currentPage, searchTerm, roleFilter);
  }, [currentPage, searchTerm, roleFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (adminId) => {
    console.log("관리자 상세보기 클릭, adminId:", adminId); // adminId 값 확인
    navigate(`/admin/admins/${adminId}`);
  };

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="관리자 관리" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <AdminListView
          admins={admins}
          loading={loading}
          error={error}
          totalCount={totalCount}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onRoleFilter={handleRoleFilter}
          onViewDetail={handleViewDetail}
          colors={colors}
        />
      </main>
    </div>
  );
};

export default AdminListPage;
