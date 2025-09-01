import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Pagination from "../../common/Pagination";
import SearchInput from "../../common/SearchInput";

/**
 * columns: [{
 *   key: string, // 데이터 키
 *   label: string, // 헤더명
 *   render?: (row) => ReactNode // 커스텀 렌더링
 * }]
 * fetchReports: (params) => Promise<{ reports: [], total_pages: number }>
 * onRowClick: (row) => void
 * searchPlaceholder: string
 * searchFilterFn?: (row, searchTerm) => boolean
 * rowKey: string
 */
const ReportTableBase = ({
  columns,
  fetchReports,
  onRowClick,
  searchPlaceholder = "신고 검색...",
  searchFilterFn,
  rowKey = "report_id",
  apiSearch = true, // 검색어를 API로 넘길지 여부
}) => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // 클라이언트 필터용
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimeout = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // 디바운스 적용: searchTerm이 바뀌면 400ms 후에 debouncedSearchTerm 변경
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  // API 호출
  const loadReports = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        sort_by: sortField,
        sort_order: sortOrder,
      };
      if (apiSearch) params.search = debouncedSearchTerm;
      const response = await fetchReports(params);
      if (response && Array.isArray(response.reports)) {
        setReports(response.reports);
        setAllReports(response.reports); // 클라이언트 필터용
        setTotalPages(response.total_pages || 1);
      } else {
        setReports([]);
        setAllReports([]);
        setTotalPages(1);
      }
    } catch (e) {
      setReports([]);
      setAllReports([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line
  }, [
    currentPage,
    statusFilter,
    sortField,
    sortOrder,
    apiSearch ? debouncedSearchTerm : null,
  ]);

  // 클라이언트 필터용 검색
  useEffect(() => {
    if (!apiSearch && searchFilterFn) {
      if (searchTerm.trim() === "") {
        setReports(allReports);
      } else {
        setReports(allReports.filter((row) => searchFilterFn(row, searchTerm)));
      }
    }
    // eslint-disable-next-line
  }, [searchTerm, allReports]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-6 mx-auto max-w-6xl bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
      <div className="flex flex-col gap-4 justify-between items-center mb-6 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          onClear={() => setSearchTerm("")}
        />
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="all">모든 상태</option>
          <option value="pending">대기 중</option>
          <option value="resolved">처리 완료</option>
          <option value="rejected">거부됨</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="mx-auto w-full max-w-6xl">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    "px-4 py-3 text-center" +
                    (col.sortable ? " cursor-pointer" : "")
                  }
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  {col.label}
                  {col.sortable && sortField === col.key && (
                    <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-400"
                >
                  로딩 중...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-400"
                >
                  신고 내역이 없습니다
                </td>
              </tr>
            ) : (
              reports.map((row) => (
                <motion.tr
                  key={row[rowKey]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.key === "severity"
                          ? "px-4 py-3 text-gray-300"
                          : "px-2 py-3 text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] text-center"
                      }
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ReportTableBase;
