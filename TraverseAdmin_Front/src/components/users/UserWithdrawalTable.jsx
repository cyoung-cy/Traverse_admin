import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { userAPI } from "../../utils/api";

const UserWithdrawalTable = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0); // 총 탈퇴 신청 수
  const [loading, setLoading] = useState(true);

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await userAPI.getWithdrawalReasons({
        page: currentPage,
        search: searchTerm,
      });
      setWithdrawalRequests(response.requests);
      setTotalPages(response.total_pages);
      setTotalRequests(response.total_requests);
    } catch (error) {
      console.error("탈퇴 요청 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, [currentPage, searchTerm]);

  const handleApprove = async (userId) => {
    if (window.confirm("정말로 이 사용자의 탈퇴를 승인하시겠습니까?")) {
      try {
        await userAPI.approveWithdrawal(userId);
        fetchWithdrawalRequests();
      } catch (error) {
        console.error("탈퇴 승인 실패:", error);
      }
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("이 사용자의 탈퇴 요청을 거절하시겠습니까?")) {
      try {
        await userAPI.rejectWithdrawal(userId);
        fetchWithdrawalRequests();
      } catch (error) {
        console.error("탈퇴 거절 실패:", error);
      }
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          탈퇴 신청 목록 ({totalRequests}건) {/* 전체 탈퇴 신청 개수 표시 */}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="사용자 검색..."
            className="py-2 pr-4 pl-10 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-300">로딩 중...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  사용자 정보
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  탈퇴 사유
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  신청일
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {withdrawalRequests.map((request) => (
                <tr key={request.user_id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-100">
                        {request.user_name}
                      </div>
                      <div className="ml-2 text-sm text-gray-400">
                        ({request.email})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {request.withdrawal_reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(request.requested_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <button
                      onClick={() => handleApprove(request.user_id)}
                      className="px-4 py-2 mr-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(request.user_id)}
                      className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
                    >
                      거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-indigo-400 hover:text-indigo-300"
        >
          이전
        </button>
        <div className="text-gray-300">
          페이지 {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="text-indigo-400 hover:text-indigo-300"
        >
          다음
        </button>
      </div>
    </motion.div>
  );
};

export default UserWithdrawalTable;
