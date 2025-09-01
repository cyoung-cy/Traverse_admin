import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  SortDesc,
  SortAsc,
  Calendar,
  Eye,
  ThumbsUp,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { postAPI } from "../../utils/api";
import SearchInput from "../common/SearchInput";
import Pagination from "../common/Pagination";

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hasReports, setHasReports] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getPosts({
        page: currentPage,
        limit: 10,
        status: statusFilter,
        search: debouncedSearchTerm,
        user_id: userId,
        sort_by: sortField,
        sort_order: sortOrder,
        has_reports: hasReports,
      });

      if (response && response.data) {
        if (Array.isArray(response.data.posts)) {
          setAllPosts(response.data.posts);
          setPosts(response.data.posts);
          setTotalPages(response.data.total_pages || 1);
        } else {
          console.error("응답의 posts 필드가 배열이 아닙니다:", response.data);
          setAllPosts([]);
          setPosts([]);
          setTotalPages(1);
        }
      } else {
        console.error("API 응답이 올바른 형식이 아닙니다:", response);
        setAllPosts([]);
        setPosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setAllPosts([]);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [
    currentPage,
    statusFilter,
    sortField,
    sortOrder,
    hasReports,
    debouncedSearchTerm,
  ]);

  const handlePostClick = (post) => {
    navigate(`/posts/${post.post_id}`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-700 text-green-100";
      case "pending":
        return "bg-yellow-700 text-yellow-100";
      case "deleted":
        return "bg-red-700 text-red-100";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "활성";
      case "pending":
        return "대기 중";
      case "deleted":
        return "삭제됨";
      default:
        return "알 수 없음";
    }
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
    <div className="p-6 mx-auto max-w-6xl bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
      {/* 필터 섹션 */}

      <div className="flex flex-col gap-4 justify-between items-center mb-2 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어"
          onClear={() => setSearchTerm("")}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="all">모든 상태</option>
          <option value="active">활성</option>
          <option value="pending">대기 중</option>
          <option value="deleted">삭제됨</option>
        </select>
      </div>
      <div className="flex justify-between mb-4">
        <label className="flex items-center mr-4 text-gray-300">
          <input
            type="checkbox"
            checked={hasReports}
            onChange={(e) => setHasReports(e.target.checked)}
            className="mr-2 w-4 h-4"
          />
          신고된 게시물만 보기
        </label>
      </div>

      {/* 게시물 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="px-4 py-3 text-center whitespace-nowrap">
                게시물 ID
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                사용자 ID
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">상태</th>
              <th
                className="px-4 py-3 text-center whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex justify-center items-center">
                  <Calendar size={16} className="mr-1" />
                  생성일
                  {sortField === "created_at" && (
                    <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                신고 수
              </th>
              <th
                className="px-4 py-3 text-center whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("like_count")}
              >
                <div className="flex items-center">
                  <ThumbsUp size={16} className="mr-1" />
                  좋아요 수
                  {sortField === "like_count" && (
                    <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-center whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("view_count")}
              >
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  조회수
                  {sortField === "view_count" && (
                    <span className="ml-1">
                      {sortOrder === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                <div className="flex items-center">
                  <Tag size={16} className="mr-1" />
                  해시태그
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-20 text-center text-gray-400">
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 animate-spin border-t-transparent"></div>
                    <span className="ml-2">로딩 중...</span>
                  </div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-20 text-center text-gray-400">
                  게시물이 없습니다
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <motion.tr
                  key={post.post_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => handlePostClick(post)}
                >
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {post.post_id}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {post.user_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {getStatusText(post.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {post.report_count > 0 ? (
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          post.report_count >= 6
                            ? "text-red-100 bg-red-700"
                            : "text-yellow-100 bg-yellow-700"
                        }`}
                      >
                        {post.report_count}
                      </span>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {post.like_count}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap">
                    {post.view_count}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex overflow-x-auto gap-1 max-w-[200px]">
                      {post.hash_tags && post.hash_tags.length > 0 ? (
                        post.hash_tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="flex-shrink-0 px-2 py-1 text-xs text-white bg-blue-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PostsList;
