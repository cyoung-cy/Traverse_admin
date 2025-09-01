import React, { useState, useEffect, useRef } from "react";
import { chatAPI } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  MessageSquare,
  FlagTriangleRight,
  CheckCircle,
  Archive,
  Ban,
  Loader,
  Search as SearchIcon,
  List as ListIcon,
  ChevronDown,
  X,
} from "lucide-react";

const ChatRoomTable = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  // API 명세서 7.1에 맞는 필터 파라미터 설정
  const [filters, setFilters] = useState({
    search: "", // 검색어
    status: "all", // 상태 필터 (all, active, archived, blocked)
    page: 1, // 현재 페이지
    limit: 10, // 페이지당 항목 수
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("room_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      // API 명세서 7.1에 맞게 채팅방 목록 조회 파라미터 전달
      const response = await chatAPI.getChatRooms({
        page: filters.page,
        limit: filters.limit,
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search || undefined,
      });

      if (
          response &&
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data.rooms)
      ) {
        setAllRooms(response.data.data.rooms);
        setTotalPages(response.data.data.total_pages || 1);
      } else {
        console.error("API 응답이 올바른 형식이 아닙니다:", response);
        setAllRooms([]);
      }

    } catch (error) {
      console.error("채팅방 목록을 불러오는데 실패했습니다:", error);
      setAllRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색어에 따라 채팅방 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setRooms(allRooms);
    } else {
      const filtered = allRooms.filter((room) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (room.name && room.name.toLowerCase().includes(searchLower)) ||
            (room.room_id && room.room_id.toString().includes(searchLower)) ||
            (room.participants &&
                room.participants.some(
                    (participant) =>
                        participant.username &&
                        participant.username.toLowerCase().includes(searchLower)
                ))
        );
      });
      setRooms(filtered);
    }
  }, [searchTerm, allRooms]);

  useEffect(() => {
    fetchChatRooms();
  }, [filters.page, filters.status, filters.limit]);

  // 채팅방 상세페이지 이동 처리
  const handleRoomClick = (roomId) => {
    navigate(`/chats/rooms/${roomId}`);
  };

  // Filter 기능
  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // List 기능
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (typeof a[sortField] === "string") {
      return order * a[sortField].localeCompare(b[sortField]);
    }
    return order * (a[sortField] - b[sortField]);
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        className: "bg-green-500",
        text: "활성",
        icon: <CheckCircle size={14} className="text-white" />,
      },
      archived: {
        className: "bg-yellow-500",
        text: "보관",
        icon: <Archive size={14} className="text-white" />,
      },
      blocked: {
        className: "bg-red-500",
        text: "차단",
        icon: <Ban size={14} className="text-white" />,
      },
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs ${statusConfig[status].className} text-white flex items-center gap-1`}
        >
        {statusConfig[status].icon}
          {statusConfig[status].text}
      </span>
    );
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
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
        {/* 필터 영역 - API 명세서 7.1 기반 검색 및 상태 필터링 */}
        <div className="flex flex-col gap-4 justify-between items-center mb-6 sm:flex-row">
          <div className="relative flex-1 max-w-sm">
            <input
                type="text"
                placeholder="채팅방 검색..."
                value={searchTerm}
                onChange={handleSearch}
                className="py-2 pr-4 pl-10 w-full text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <SearchIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                >
                  <X size={16} />
                </button>
            )}
          </div>
          <select
              value={filters.status}
              onChange={handleStatusChange}
              className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="archived">보관</option>
            <option value="blocked">차단</option>
          </select>
        </div>

        {/* 리스트 영역 - API 명세서 7.1 응답 데이터에 맞게 표시 */}
        {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size={30} className="text-blue-500 animate-spin" />
            </div>
        ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th
                        className="px-4 py-3 text-left cursor-pointer"
                        onClick={() => handleSort("room_id")}
                    >
                      채팅방 ID
                      {sortField === "room_id" && (
                          <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left">채팅방 이름</th>
                    <th className="px-4 py-3 text-left">유형</th>
                    <th
                        className="px-4 py-3 text-left cursor-pointer"
                        onClick={() => handleSort("participants")}
                    >
                      참여자 수
                      {sortField === "participants" && (
                          <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                      )}
                    </th>
                    <th
                        className="px-4 py-3 text-left cursor-pointer"
                        onClick={() => handleSort("message_count")}
                    >
                      메시지 수
                      {sortField === "message_count" && (
                          <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                      )}
                    </th>
                    <th
                        className="px-4 py-3 text-left cursor-pointer"
                        onClick={() => handleSort("report_count")}
                    >
                      신고 수
                      {sortField === "report_count" && (
                          <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left">상태</th>
                    <th
                        className="px-4 py-3 text-left cursor-pointer"
                        onClick={() => handleSort("created_at")}
                    >
                      생성일
                      {sortField === "created_at" && (
                          <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                      )}
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {sortedRooms.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-4 text-center text-gray-400">
                          채팅방이 없습니다
                        </td>
                      </tr>
                  ) : (
                      sortedRooms.map((room) => (
                          <motion.tr
                              key={room.room_id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                              onClick={() => handleRoomClick(room.room_id)}
                          >
                            <td className="px-4 py-3 text-gray-300">
                              {room.room_id}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              <div className="flex gap-2 items-center">
                                {room.type === "direct" ? (
                                    <MessageCircle
                                        size={16}
                                        className="text-blue-400"
                                    />
                                ) : (
                                    <Users size={16} className="text-green-400" />
                                )}
                                {room.name}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                room.type === "direct"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                            } text-white`}
                        >
                          {room.type === "direct" ? "1:1" : "그룹"}
                        </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              <div className="flex gap-1 items-center">
                                <Users size={14} />
                                {room.participants.length}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              <div className="flex gap-1 items-center">
                                <MessageSquare size={14} />
                                {room.message_count}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              <div className="flex gap-1 items-center">
                                <FlagTriangleRight
                                    size={14}
                                    className={
                                      room.report_count > 0
                                          ? "text-red-400"
                                          : "text-green-400"
                                    }
                                />
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        room.report_count > 0
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    } text-white`}
                                >
                            {room.report_count}
                          </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {getStatusBadge(room.status)}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {formatDate(room.created_at)}
                            </td>
                          </motion.tr>
                      ))
                  )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 - API 명세서 7.1 응답의 페이지 정보 사용 */}
              {totalPages > 1 && (
                  <div className="flex gap-2 justify-center mt-6">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 disabled:opacity-50"
                    >
                      이전
                    </button>
                    <span className="px-4 py-2 text-gray-400">
                {filters.page} / {totalPages}
              </span>
                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 disabled:opacity-50"
                    >
                      다음
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default ChatRoomTable;
