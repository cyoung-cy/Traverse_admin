import { useState, useEffect } from "react";
import SearchInput from "../common/SearchInput";
import Pagination from "../common/Pagination";
import { inquiriesAPI } from "../../utils/api";

const statusText = {
  pending: "대기 중",
  answered: "답변 완료",
};

const InquiriesTable = ({ onRowClick }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // 컬럼 정의 (내부에서 직접)
  const columns = [
    { key: "id", label: "번호", render: (row, idx) => idx + 1, sortable: true },
    { key: "category", label: "카테고리" },
    { key: "message", label: "내용" },
    {
      key: "status",
      label: "상태",
      render: (row) => statusText[row.status] || row.status,
    },
    {
      key: "created_at",
      label: "작성일",
      render: (row) => row.created_at.slice(0, 10),
      sortable: true,
    },
  ];

  // API 호출 함수 (내부에서 직접)
  const fetchInquiries = async (params) => {
    try {
      const response = await inquiriesAPI.getInquiries({
        page: params.page,
        limit: 10,
        status: params.status,
        search: params.search,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
      });
      const data = response.data.data; // 안되면 data.data로 바꿔야함

      return {
        inquiries: data.inquiries,
        total_pages: Math.ceil(data.total / data.limit), // total_pages 계산 필요
      };
    } catch (e) {
      return { inquiries: [], total_pages: 1 };
    }
  };

  // 데이터 로드
  const loadInquiries = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      status: statusFilter,
      search: searchTerm,
      sort_by: sortField,
      sort_order: sortOrder,
    };
    const result = await fetchInquiries(params);

    setInquiries(result.inquiries);
    setTotalPages(result.total_pages);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
    // eslint-disable-next-line
  }, [currentPage, statusFilter, searchTerm, sortField, sortOrder]);

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
      <div className="p-8 mx-auto mt-12 max-w-4xl bg-gray-800 bg-opacity-90 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-lg transition-all duration-300">
        <div className="flex flex-col gap-4 justify-between items-center mb-8 sm:flex-row">
          <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="문의 검색..."
              onClear={() => setSearchTerm("")}
              className="w-full sm:w-64"
          />
          <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="px-5 py-2 text-gray-200 bg-gray-700 rounded-xl border border-gray-600 shadow-md transition-all focus:outline-none focus:border-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기 중</option>
            <option value="answered">답변 완료</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="mx-auto w-full max-w-3xl text-sm sm:text-base">
            <thead>
            <tr className="text-gray-300 bg-gray-700 border-b-2 border-gray-600">
              {columns.map((col) => (
                  <th
                      key={col.key}
                      className={
                          "px-5 py-3 text-center font-semibold tracking-wide select-none" +
                          (col.sortable
                              ? " cursor-pointer hover:text-blue-400 transition-colors"
                              : "")
                      }
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    {col.label}
                    {col.sortable && sortField === col.key && (
                        <span className="ml-1 text-blue-400">
                      {sortOrder === "desc" ? "▼" : "▲"}
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
                      className="py-8 text-center text-gray-400"
                  >
                    <span className="animate-pulse">로딩 중...</span>
                  </td>
                </tr>
            ) : !inquiries || inquiries.length === 0 ? (
                <tr>
                  <td
                      colSpan={columns.length}
                      className="py-8 text-center text-gray-400"
                  >
                    문의 내역이 없습니다
                  </td>
                </tr>
            ) : (
                inquiries.map((row, idx) => (
                    <tr
                        key={row.id}
                        className="border-b border-gray-700 transition-colors cursor-pointer hover:bg-gray-700/80 group"
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                      {columns.map((col) => (
                          <td key={col.key} className="px-5 py-3 text-center">
                            {col.key === "status" ? (
                                <span
                                    className={
                                      row.status === "answered"
                                          ? "inline-block px-3 py-1 rounded-full bg-green-600/80 text-white text-xs font-bold"
                                          : "inline-block px-3 py-1 rounded-full bg-yellow-500/80 text-white text-xs font-bold"
                                    }
                                >
                          {col.render ? col.render(row, idx) : row[col.key]}
                        </span>
                            ) : col.render ? (
                                col.render(row, idx)
                            ) : (
                                row[col.key]
                            )}
                          </td>
                      ))}
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
              />
            </div>
        )}
      </div>
  );
};

export default InquiriesTable;
