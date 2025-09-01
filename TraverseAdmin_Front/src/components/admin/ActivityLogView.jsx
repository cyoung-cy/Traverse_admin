import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "../common/Pagination";

const ActivityLogView = ({
  logs = [],
  loading = false,
  error = null,
  totalCount = 0,
  pageCount = 0,
  currentPage = 1,
  onPageChange,
  onFilterChange,
  filters,
  colors,
}) => {
  const [adminId, setAdminId] = useState(filters.admin_id || "");
  const [actionType, setActionType] = useState(filters.action_type || "");
  const [startDate, setStartDate] = useState(
    filters.start_date ? filters.start_date : ""
  );
  const [endDate, setEndDate] = useState(
    filters.end_date ? filters.end_date : ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const handleSearch = () => {
    const newFilters = {
      admin_id: adminId || null,
      action_type: actionType || null,
      start_date: startDate || null,
      end_date: endDate || null,
    };
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    setAdminId("");
    setActionType("");
    setStartDate("");
    setEndDate("");
    onFilterChange({
      admin_id: null,
      action_type: null,
      start_date: null,
      end_date: null,
    });
  };

  const toggleRowExpanded = (logId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  // 활동 유형 목록
  const actionTypes = [
    "로그인",
    "관리자 추가",
    "관리자 역할 변경",
    "관리자 상태 변경",
    "사용자 상태 변경",
    "게시물 삭제",
    "신고 처리",
    "채팅방 차단",
    "시스템 설정 변경",
    "알림 발송",
    "매칭 설정 변경",
    "해시태그 상태 변경",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-700 animate-spin border-t-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 mb-5 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 text-lg font-medium text-gray-100">
            활동 로그 필터
          </h3>
          <button
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-indigo-500 text-indigo-400 bg-transparent hover:bg-indigo-900 hover:bg-opacity-20"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showFilters ? "필터 닫기" : "필터 열기"}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm text-gray-400"
                  htmlFor="adminId"
                >
                  관리자 ID
                </label>
                <input
                  id="adminId"
                  type="text"
                  className="p-2 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="관리자 ID 입력"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block mb-2 text-sm text-gray-400"
                  htmlFor="actionType"
                >
                  활동 유형
                </label>
                <select
                  id="actionType"
                  className="w-full p-2 pr-10 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzZiNzI4MCIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMjkzIDcuMjkzYTEgMSAwIDAxMS40MTQgMEwxMCAxMC41ODZsNC4yOTMtNC4yOTNhMSAxIDAgMTExLjQxNCAxLjQxNGwtNSA1YS45OTguOTk4IDAgMDEtMS40MTQgMGwtNS01YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_1rem] bg-[length:1rem_1rem]"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="">전체</option>
                  {actionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block mb-2 text-sm text-gray-400"
                  htmlFor="startDate"
                >
                  시작일
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="p-2 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block mb-2 text-sm text-gray-400"
                  htmlFor="endDate"
                >
                  종료일
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="p-2 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 text-sm text-gray-200 rounded border border-gray-700 hover:bg-gray-700"
                onClick={handleResetFilters}
              >
                초기화
              </button>
              <button
                className="flex gap-1 items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                onClick={handleSearch}
              >
                <Search size={14} /> 검색
              </button>
            </div>
          </div>
        )}
      </div>

      {logs.length > 0 ? (
        <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="p-3 font-medium text-left">로그 ID</th>
                  <th className="p-3 font-medium text-left">관리자</th>
                  <th className="p-3 font-medium text-left">활동 내용</th>
                  <th className="p-3 font-medium text-left">시간</th>
                  <th className="p-3 font-medium text-left">IP 주소</th>
                  <th className="p-3 font-medium text-left">상세</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <React.Fragment key={log.log_id}>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{log.log_id}</td>
                      <td className="p-3 text-green-300">
                        {log.admin_name} ({log.admin_id})
                      </td>
                      <td className="p-3">{log.action}</td>
                      <td className="p-3">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">{log.ip_address}</td>
                      <td className="p-3">
                        <button
                          className="p-1 text-indigo-400 rounded-full hover:bg-indigo-900 hover:bg-opacity-20"
                          onClick={() => toggleRowExpanded(log.log_id)}
                        >
                          {expandedRows[log.log_id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[log.log_id] && (
                      <tr className="bg-gray-900">
                        <td colSpan={6} className="p-4">
                          <div>
                            <h4 className="mb-3 text-base font-medium text-gray-100">
                              상세 정보
                            </h4>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                              <div>
                                <span className="mr-2 font-medium text-gray-400">
                                  대상 ID:
                                </span>{" "}
                                <span className="text-gray-200">
                                  {log.target_id || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="mr-2 font-medium text-gray-400">
                                  대상 유형:
                                </span>{" "}
                                <span className="text-gray-200">
                                  {log.target_type || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="mr-2 font-medium text-gray-400">
                                  이전 상태:
                                </span>{" "}
                                <span className="text-gray-200">
                                  {log.previous_state || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="mr-2 font-medium text-gray-400">
                                  변경 후 상태:
                                </span>{" "}
                                <span className="text-gray-200">
                                  {log.new_state || "-"}
                                </span>
                              </div>
                              <div className="col-span-4 mb-2">
                                <span className="block mb-2 font-medium text-yellow-400">
                                  디버깅 정보:
                                </span>
                                <pre className="overflow-x-auto p-3 mt-2 font-mono text-xs text-gray-200 whitespace-pre-wrap bg-gray-800 rounded border border-gray-700">
                                  {JSON.stringify(log, null, 2)}
                                </pre>
                              </div>
                              <div className="col-span-4">
                                <span className="block mb-2 font-medium text-gray-400">
                                  추가 정보:
                                </span>
                                <pre className="overflow-x-auto p-3 mt-2 font-mono text-xs text-gray-200 whitespace-pre-wrap bg-gray-800 rounded border border-gray-700">
                                  {log.additional_data
                                    ? JSON.stringify(
                                        JSON.parse(log.additional_data),
                                        null,
                                        2
                                      )
                                    : "-"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between items-center p-4 bg-gray-800 border-t border-gray-700 sm:flex-row">
            <div className="mb-3 text-sm text-gray-400 sm:mb-0">
              총 {totalCount}개 항목 중 {(currentPage - 1) * 15 + 1}-
              {Math.min(currentPage * 15, totalCount)}개 표시
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-12 text-gray-400 bg-gray-800 rounded-lg">
          <p>표시할 활동 로그가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLogView;
