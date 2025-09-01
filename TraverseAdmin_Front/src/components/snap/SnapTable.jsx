import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { snapAPI } from "../../utils/api";
import Pagination from "../common/Pagination";
import SearchInput from "../common/SearchInput";

const STATUS_OPTIONS = [
  { value: "all", label: "모든 상태" },
  { value: "active", label: "활성" },
  { value: "pending", label: "대기" },
  { value: "hidden", label: "숨김" },
  { value: "deleted", label: "삭제됨" },
];

const SnapTable = () => {
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const navigate = useNavigate();

  // --- 데이터 불러오기 함수 ---
  // 스냅 목록 불러오기
  const loadSnaps = () => {
    setLoading(true);
    setError(null);
    const params = { page, limit };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== "all") params.status = statusFilter;
    if (sort.key) {
      params.sort_by = sort.key;
      params.sort_order = sort.direction;
    }
    snapAPI
        .getSnaps(params)
        .then((res) => {
          const snapsData = res?.data?.snaps || res?.data?.data?.snaps;
          setSnaps(Array.isArray(snapsData) ? snapsData : []);
          setTotalPages(res?.data?.data?.total_pages || 1);
        })
        .catch(() => {
          setError("스냅 목록을 불러오지 못했습니다.");
        })
        .finally(() => setLoading(false));
  };

  // --- useEffect: 데이터 로딩 ---
  useEffect(() => {
    loadSnaps();
    // eslint-disable-next-line
  }, [page, limit, searchTerm, statusFilter, sort]);

  // --- 핸들러 함수 ---
  // 정렬 핸들러
  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  // 상태 변경 핸들러
  const handleStatusChange = (snapId, newStatus) => {
    if (!window.confirm("상태를 변경하시겠습니까?")) return;
    snapAPI
        .updateSnapStatus(snapId, { status: newStatus })
        .then(() => {
          loadSnaps();
        })
        .catch(() => {
          alert("상태 변경에 실패했습니다.");
        });
  };

  // 행 클릭 핸들러
  const handleRowClick = (snapId) => {
    navigate(`/snaps/${snapId}`);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // 상태 필터 핸들러
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  return (
      <div className="p-6 mx-auto max-w-6xl bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
        {/* 검색/필터 */}
        <div className="flex flex-col gap-4 justify-between items-center mb-6 sm:flex-row">
          <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="스냅 검색..."
              onClear={() => setSearchTerm("")}
          />
          <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
            ))}
          </select>
        </div>
        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="mx-auto w-full max-w-6xl">
            <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("id")}
              >
                ID {sort.key === "id" && (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("title")}
              >
                제목{" "}
                {sort.key === "title" && (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("user_id")}
              >
                작성자{" "}
                {sort.key === "user_id" &&
                    (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("status")}
              >
                상태{" "}
                {sort.key === "status" &&
                    (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("created_at")}
              >
                생성일{" "}
                {sort.key === "created_at" &&
                    (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("like_count")}
              >
                좋아요{" "}
                {sort.key === "like_count" &&
                    (sort.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort("view_count")}
              >
                조회수{" "}
                {sort.key === "view_count" &&
                    (sort.direction === "asc" ? "▲" : "▼")}
              </th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-400">
                    로딩 중...
                  </td>
                </tr>
            ) : snaps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-400">
                    스냅 데이터가 없습니다.
                  </td>
                </tr>
            ) : (
                snaps.map((snap) => (
                    <tr
                        key={snap.id}
                        className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleRowClick(snap.id)}
                    >
                      <td className="px-4 py-3 text-gray-300">{snap.id}</td>
                      <td className="px-4 py-3 text-gray-300">{snap.title}</td>
                      <td className="px-4 py-3 text-gray-300">{snap.user_id}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {(() => {
                          const statusValue = snap.status || "active";
                          const statusLabel =
                              STATUS_OPTIONS.find((opt) => opt.value === statusValue)
                                  ?.label || statusValue;
                          const badgeClass =
                              statusValue === "active"
                                  ? "bg-green-700 text-green-100"
                                  : statusValue === "hidden"
                                      ? "bg-yellow-700 text-yellow-100"
                                      : statusValue === "deleted"
                                          ? "bg-red-700 text-red-100"
                                          : "bg-gray-700 text-gray-100";
                          return (
                              <span
                                  className={`px-2 py-1 text-sm font-semibold rounded select-none ${badgeClass}`}
                              >
                          {statusLabel}
                        </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{snap.created_at}</td>
                      <td className="px-4 py-3 text-gray-300">{snap.like_count}</td>
                      <td className="px-4 py-3 text-gray-300">{snap.view_count}</td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
        {/* 페이지네이션 */}
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
        />
      </div>
  );
};

export default SnapTable;
