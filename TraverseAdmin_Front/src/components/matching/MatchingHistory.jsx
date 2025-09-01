import { useState, useEffect } from "react";
import { matchingAPI } from "../../utils/api";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Pagination from "../common/Pagination";

const MatchingHistory = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchUserId, setSearchUserId] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // 매칭 히스토리 불러오기
  useEffect(() => {
    const fetchMatchingHistory = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
          status: filterStatus,
          user_id: searchUserId || undefined,
        };

        const response = await matchingAPI.getMatchingHistory(params);
        console.log("[매칭 히스토리 API 응답]", response);
        if (response.success) {
          setMatches(response.data.matches);
          setTotalPages(response.data.total_pages);
          setTotalCount(response.data.total_count);
        }
      } catch (error) {
        console.error(
          "매칭 히스토리를 불러오는 중 오류가 발생했습니다:",
          error
        );
        toast.error("매칭 히스토리를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingHistory();
  }, [currentPage, filterStatus, searchUserId]);

  // 페이지 변경 처리
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 필터 변경 처리
  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  // 사용자 ID 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 매칭 상태에 따른 배지 스타일
  const getStatusBadgeClass = (status) => {
    let statusValue = status || "active";
    return statusValue === "successful"
      ? "bg-green-700 text-green-100"
      : statusValue === "active"
      ? "bg-blue-700 text-blue-100"
      : statusValue === "failed"
      ? "bg-red-700 text-red-100"
      : "bg-gray-700 text-gray-200";
  };

  // 매칭 상태 한글화
  const getStatusText = (status) => {
    let statusValue = status || "active";
    return statusValue === "successful"
      ? "성공"
      : statusValue === "active"
      ? "진행 중"
      : statusValue === "failed"
      ? "실패"
      : statusValue;
  };

  if (loading && matches.length === 0) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
        <div className="flex justify-center items-center h-40">
          <div className="text-xl text-gray-400">
            매칭 히스토리를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
      <h2 className="mb-6 text-xl font-semibold">매칭 히스토리</h2>

      {/* 필터 및 검색 */}
      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 text-sm bg-gray-700 rounded-md border border-gray-600"
          >
            <option value="all">모든 상태</option>
            <option value="successful">성공</option>
            <option value="active">진행 중</option>
            <option value="failed">실패</option>
          </select>
          <div className="text-sm text-gray-400">총 {totalCount}개의 매칭</div>
        </div>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="사용자 ID로 검색"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-700 rounded-l-md border border-gray-600"
          />
          <button
            type="submit"
            className="px-3 py-2 text-sm bg-blue-600 rounded-r-md border border-blue-600 hover:bg-blue-700"
          >
            검색
          </button>
        </form>
      </div>

      {/* 매칭 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">매칭 ID</th>
              <th className="px-4 py-3">사용자 1</th>
              <th className="px-4 py-3">사용자 2</th>
              <th className="px-4 py-3">생성일</th>
              <th className="px-4 py-3">점수</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3 rounded-tr-lg">메시지</th>
            </tr>
          </thead>
          <tbody>
            {matches.length > 0 ? (
              matches.map((match) => (
                <tr
                  key={match.match_id}
                  className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => navigate(`/matching/${match.match_id}`)}
                >
                  <td className="px-4 py-3">{match.match_id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{match.user1_name}</div>
                    <div className="text-xs text-gray-400">
                      {match.user1_id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{match.user2_name}</div>
                    <div className="text-xs text-gray-400">
                      {match.user2_id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(match.created_at), "yyyy.MM.dd HH:mm", {
                      locale: ko,
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {match.score.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded ${getStatusBadgeClass(
                        match.status
                      )}`}
                    >
                      {getStatusText(match.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {match.message_count > 0 ? (
                      <div className="flex items-center">
                        <span className="mr-2">{match.message_count}</span>
                        {match.chat_room_id && (
                          <Link
                            to={`/chats/rooms/${match.chat_room_id}`}
                            className="text-xs text-blue-400 hover:text-blue-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            채팅방 보기
                          </Link>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  매칭 내역이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MatchingHistory;
