import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BarChart2, TrendingUp, ArrowDownUp } from "lucide-react";
import { hashtagAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HashtagsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // 트렌드 필터 (all, hot, new, stable)
  const [sortBy, setSortBy] = useState("usage_count"); // 정렬 기준
  const [sortOrder, setSortOrder] = useState("desc"); // 정렬 순서
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  const fetchHashtags = async (
    page = 1,
    limit = 50,
    search = "",
    type = "all",
    sortBy = "usage_count",
    sortOrder = "desc"
  ) => {
    setLoading(true);
    try {
      console.log("해시태그 조회:", {
        page,
        limit,
        search,
        type,
        sortBy,
        sortOrder,
      });
      console.log("fetchHashtags 호출됨"); // 이 로그가 출력되는지 확인해보세요.

      const response = await hashtagAPI.getHashtags({
        page,
        limit,
        search,
        type,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (response.data && response.data.success) {
        setHashtags(response.data.hashtags);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.total_pages);
        console.log("해시태그 목록:", response.data);
      }
    } catch (error) {
      console.error("해시태그 목록 조회 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHashtags(currentPage, 50, searchTerm, typeFilter, sortBy, sortOrder);
  }, [currentPage, searchTerm, typeFilter, sortBy, sortOrder]);

  // 데이터 로딩 후
  useEffect(() => {
    if (!loading && hashtags.length > 0) {
      console.log("데이터 로딩 완료:", hashtags);
    }
  }, [loading, hashtags]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // 검색 시 첫 페이지로
    fetchHashtags(1, 50, term, typeFilter, sortBy, sortOrder);
  };

  const handleTypeFilter = (e) => {
    const type = e.target.value;
    setTypeFilter(type);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
    fetchHashtags(1, 50, searchTerm, type, sortBy, sortOrder);
  };

  const handleSort = (field) => {
    const newSortOrder =
      field === sortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로
    fetchHashtags(1, 50, searchTerm, typeFilter, field, newSortOrder);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchHashtags(page, 50, searchTerm, typeFilter, sortBy, sortOrder);
  };

  const goToHashtagDetail = (hashtagId) => {
    navigate(`/hashtags/${hashtagId}`);
  };

  // 트렌드 상태에 따른 배지 색상과 아이콘
  const getTrendBadge = (trend) => {
    switch (trend) {
      case "hot":
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium text-red-100 bg-red-600 rounded-full">
            <TrendingUp size={14} className="mr-1" />
            인기
          </span>
        );
      case "new":
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium text-blue-100 bg-blue-600 rounded-full">
            <BarChart2 size={14} className="mr-1" />
            신규
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium text-gray-100 bg-gray-600 rounded-full">
            안정
          </span>
        );
    }
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status) => {
    let statusValue = status || "active";
    let statusLabel =
      statusValue === "active"
        ? "활성"
        : statusValue === "blocked"
        ? "차단됨"
        : statusValue === "featured"
        ? "주목"
        : statusValue;
    let badgeClass =
      statusValue === "active"
        ? "bg-green-700 text-green-100"
        : statusValue === "blocked"
        ? "bg-red-700 text-red-100"
        : statusValue === "featured"
        ? "bg-yellow-700 text-yellow-100"
        : "bg-gray-700 text-gray-200";
    return (
      <span className={`px-2 py-1 text-sm font-semibold rounded ${badgeClass}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="해시태그 검색..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 pl-10 w-full text-white bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2"
            size={18}
          />
        </div>

        <select
          value={typeFilter}
          onChange={handleTypeFilter}
          className="p-2 text-white bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 트렌드</option>
          <option value="hot">인기</option>
          <option value="new">신규</option>
          <option value="stable">안정</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 rounded-full border-4 animate-spin border-t-blue-500 border-b-blue-700"></div>
        </div>
      ) : hashtags.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          해시태그를 찾을 수 없습니다
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-200 border-collapse">
              <thead>
                <tr className="bg-gray-800 bg-opacity-60">
                  <th className="px-4 py-3 text-left border-b border-gray-700">
                    해시태그
                  </th>
                  <th
                    className="px-4 py-3 text-left border-b border-gray-700 cursor-pointer"
                    onClick={() => handleSort("usage_count")}
                  >
                    <div className="flex items-center">
                      <span>사용 횟수</span>
                      {sortBy === "usage_count" && (
                        <ArrowDownUp size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left border-b border-gray-700 cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center">
                      <span>생성일</span>
                      {sortBy === "created_at" && (
                        <ArrowDownUp size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left border-b border-gray-700">
                    마지막 사용
                  </th>
                  <th className="px-4 py-3 text-left border-b border-gray-700">
                    트렌드
                  </th>
                  <th className="px-4 py-3 text-left border-b border-gray-700">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {hashtags.map((hashtag) => (
                  <motion.tr
                    key={hashtag.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
                    onClick={() => goToHashtagDetail(hashtag.id)}
                    className="border-b border-gray-700 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">#{hashtag.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      {hashtag.usage_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(hashtag.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(hashtag.last_used_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {getTrendBadge(hashtag.trend)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(hashtag.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="mx-4 text-gray-300">
              {currentPage} / {totalPages} 페이지 (총 {totalCount}개)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HashtagsTable;
