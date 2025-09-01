import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import Pagination from "../common/Pagination";

const AdminListView = ({
  admins = [],
  loading = false,
  error = null,
  totalCount = 0,
  pageCount = 0,
  currentPage = 1,
  onPageChange,
  onSearch,
  onRoleFilter,
  onViewDetail,
  colors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setRoleFilter(role);
    onRoleFilter(role);
  };

  const roleMap = {
    chief_manager: "최고관리자",
    post_manager: "게시물관리자",
    chat_manager: "채팅관리자",
    user_manager: "사용자관리자",
    data_manager: "데이터관리자",
  };

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
      <div className="flex flex-col gap-4 justify-between items-center mb-4 md:flex-row">
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              className="p-2 pr-10 pl-3 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="관리자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={handleSearchSubmit}
            >
              <Search size={18} />
            </button>
          </div>
          <button
            className="flex gap-2 items-center px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            onClick={handleSearchSubmit}
          >
            <Search size={16} />
            검색
          </button>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <select
              className="w-full md:w-48 p-2 pr-10 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzZiNzI4MCIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMjkzIDcuMjkzYTEgMSAwIDAxMS40MTQgMEwxMCAxMC41ODZsNC4yOTMtNC4yOTNhMSAxIDAgMTExLjQxNCAxLjQxNGwtNSA1YS45OTguOTk4IDAgMDEtMS40MTQgMGwtNS01YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_1rem] bg-[length:1rem_1rem]"
              value={roleFilter}
              onChange={handleRoleChange}
            >
              <option value="all">전체</option>
              <option value="chief_manager">최고관리자</option>
              <option value="post_manager">게시물관리자</option>
              <option value="chat_manager">채팅관리자</option>
              <option value="user_manager">사용자관리자</option>
              <option value="data_manager">데이터관리자</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="p-3 font-medium text-left">ID</th>
                <th className="p-3 font-medium text-left">이름</th>
                <th className="p-3 font-medium text-left">이메일</th>
                <th className="p-3 font-medium text-left">역할</th>
                <th className="p-3 font-medium text-left">상태</th>
                <th className="p-3 font-medium text-left">마지막 로그인</th>
                <th className="p-3 font-medium text-left">관리</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                console.log("Admin ID:", admin.admin_id); // admin_id 값 확인
                return (
                  <tr
                    key={admin.admin_id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="p-3">{admin.admin_id}</td>
                    <td className="p-3 text-green-300">{admin.name}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{roleMap[admin.role] || admin.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          !admin.status || admin.status === "active"
                            ? "bg-green-800 text-green-200"
                            : admin.status === "suspended"
                            ? "bg-red-800 text-red-200"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {!admin.status || admin.status === "active"
                          ? "활성"
                          : admin.status === "suspended"
                          ? "정지"
                          : "삭제됨"}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(admin.last_login_at).toLocaleString("ko-KR")}
                    </td>
                    <td className="p-3">
                      <button
                        className="p-1 text-indigo-400 rounded hover:bg-indigo-900 hover:bg-opacity-20"
                        onClick={() => onViewDetail(admin.admin_id)}
                        title="상세보기"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between items-center p-4 bg-gray-800 border-t border-gray-700 sm:flex-row">
          <div className="mb-3 text-sm text-gray-400 sm:mb-0">
            총 {totalCount}명의 관리자
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminListView;
