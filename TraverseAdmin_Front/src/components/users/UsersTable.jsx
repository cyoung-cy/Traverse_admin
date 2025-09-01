import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical } from "lucide-react";
import { userAPI } from "../../utils/api"; // userAPI를 가져옵니다
import { useNavigate } from "react-router-dom";
import SearchInput from "../common/SearchInput";
import Pagination from "../common/Pagination";

const UsersTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // 상태 필터
  const [sortBy, setSortBy] = useState("created_at"); // 정렬 기준
  const [sortOrder, setSortOrder] = useState("desc"); // 정렬 순서
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  // 상태 변경 관련 상태 추가
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchUsers = async (
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      sortBy = "created_at",
      sortOrder = "desc"
  ) => {
    setLoading(true);
    try {
      console.log("Fetching users with:", {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });

      const response = await userAPI.getUsers({
        page,
        limit,
        search,
        status,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      console.log("Full response:", response); // response 전체를 먼저 출력

      if (response.success) {
        // if (response.data.success) {
        console.log("responsepage", response);
        const users = Array.isArray(response.data.users)
            ? response.data.users
            : []; // response.data.users가 배열인지 확인 후 배열로 처리

        setFilteredUsers(users);
        setTotalCount(response.data.total_count);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.error("사용자 목록 조회 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, 10, searchTerm, statusFilter, sortBy, sortOrder); // 초기 사용자 목록 조회
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchUsers(1, 10, term, statusFilter, sortBy, sortOrder); // 검색어에 따라 사용자 목록 재조회
  };

  const handleStatusChange = async (userId, statusData) => {
    setStatusLoading(true);
    try {
      const response = await userAPI.updateUserStatus(userId, statusData);
      if (response.success) {
        setStatusMessage({ type: "success", text: response.message });
        // 상태 변경 후 목록 새로고침
        fetchUsers(
            currentPage,
            20,
            searchTerm,
            statusFilter,
            sortBy,
            sortOrder
        );
      } else {
        setStatusMessage({ type: "error", text: response.error.message });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "상태 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setStatusLoading(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSortChange = (field) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"; // 정렬 순서 변경
    setSortBy(field);
    setSortOrder(newSortOrder);
    fetchUsers(1, 20, searchTerm, statusFilter, field, newSortOrder); // 정렬 기준 변경 시 사용자 목록 재조회
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchUsers(page, 20, searchTerm, statusFilter, sortBy, sortOrder);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
      <motion.div
          className="p-6 mx-auto max-w-6xl bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
      >
        {/* 상태 메시지 표시 */}
        {statusMessage && (
            <div
                className={`mb-4 p-4 rounded-lg ${
                    statusMessage.type === "success" ? "bg-green-600" : "bg-red-600"
                } bg-opacity-50`}
            >
              <p className="text-white">{statusMessage.text}</p>
            </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            {/* 상태 필터 */}
            <select
                className="px-4 py-2 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div className="relative">
            <SearchInput
                value={searchTerm}
                onChange={handleSearch}
                placeholder="유저 검색..."
                onClear={() => setSearchTerm("")}
            />
          </div>
        </div>

        {loading ? (
            <p className="text-gray-300">로딩 중...</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    아이디/이름
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    이메일/인증
                  </th>
                  {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                  국가
                </th> */}
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    신고
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    상태
                  </th>
                  <th
                      className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase cursor-pointer"
                      onClick={() => handleSortChange("created_at")}
                  >
                    가입일
                    {sortBy === "created_at" && (
                        <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                    )}
                  </th>
                  {/* <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase cursor-pointer"
                  onClick={() => handleSortChange("last_login_at")}
                >
                  최근 접속일
                  {sortBy === "last_login_at" && (
                    <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </th> */}
                </tr>
                </thead>

                {/* map 오류 수정*/}
                <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                    <motion.tr
                        key={user.user_id}
                        className="cursor-pointer hover:bg-gray-700"
                        onClick={() => handleUserClick(user.user_id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            {user.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt={user.user_name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-10 h-10 font-semibold text-white bg-gradient-to-r from-purple-400 to-blue-500 rounded-full">
                                  {user.user_name.charAt(0)}
                                </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-100">
                              {user.user_name} {/*이름*/}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.user_id} {/*아이디*/}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="px-4 py-3 text-center text-gray-300">
                          {user.email}
                        </div>
                        {/*이메일*/}
                        {/* <div className="flex gap-1 mt-1">
                      {Array.isArray(user.verify) && user.verify.length > 0 ? (
                        user.verify.map((v) => (
                          <span
                            key={v}
                            className="px-2 text-xs text-green-300 bg-green-900 rounded-full"
                          >
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          가입형태 없음
                        </span>
                      )}
                    </div> */}
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap"> */}
                      {/* <span className="inline-flex px-7 text-xs font-semibold leading-5 text-yellow-100 bg-yellow-800 rounded-full"> */}
                      {/* {user.country_code} 국가 */}
                      {/* </span> */}
                      {/* </td> */}

                      <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    <span
                        className={`px-10 inline-flex text-center text-xs leading-5 font-semibold rounded-full ${
                            user.report_count > 5
                                ? "bg-red-800 text-red-100"
                                : "bg-gray-800 text-gray-100"
                        }`}
                    >
                      {user.report_count} {/*신고횟수*/}
                    </span>
                      </td>

                      <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setStatusModalOpen(true);
                            }}
                            className={`px-2 py-1 text-sm font-semibold rounded ${
                                !user.status || user.status === "Active"
                                    ? "bg-green-700 text-green-100"
                                    : user.status === "Suspended"
                                        ? "bg-yellow-700 text-yellow-100"
                                        : user.status === "Deleted"
                                            ? "bg-red-700 text-red-100"
                                            : "bg-gray-700 text-gray-200"
                            }`}
                        >
                          {!user.status || user.status === "Active"
                              ? "Active"
                              : user.status === "Suspended"
                                  ? "Suspended"
                                  : user.status === "Deleted"
                                      ? "Deleted"
                                      : user.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                        <div className="text-center">
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    <div className="text-center">
                      {formatDate(user.last_login_at)}
                    </div>
                  </td> */}
                    </motion.tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}

        {/* 상태 변경 모달 */}
        {statusModalOpen && selectedUser && (
            <StatusChangeModal
                currentStatus={selectedUser.status}
                onClose={() => {
                  setStatusModalOpen(false);
                  setSelectedUser(null);
                }}
                onSubmit={(statusData) =>
                    handleStatusChange(selectedUser.user_id, statusData)
                }
                loading={statusLoading}
            />
        )}
      </motion.div>
  );
};

// 상태 변경 모달 컴포넌트
const StatusChangeModal = ({ currentStatus, onClose, onSubmit, loading }) => {
  const [status, setStatus] = useState(
      currentStatus?.toLowerCase() || "active"
  );
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      status:
          status === "active"
              ? "Active"
              : status === "suspended"
                  ? "Suspended"
                  : "Deleted",
      reason,
      duration_days: status === "suspended" ? Number(duration) : undefined,
    });
    onClose();
  };

  return (
      <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg">
          <h3 className="mb-4 text-xl font-semibold text-white">
            사용자 상태 변경
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                상태
              </label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
                  required
              >
                <option value="active">활성화</option>
                <option value="suspended">정지</option>
                <option value="deleted">삭제</option>
              </select>
            </div>

            {status === "suspended" && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    정지 기간 (일)
                  </label>
                  <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
                      required
                      min="1"
                  />
                </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                사유
              </label>
              <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="p-2 w-full text-white bg-gray-700 rounded-lg border border-gray-600"
                  rows="3"
                  required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                취소
              </button>
              <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "처리 중..." : "변경"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UsersTable;
