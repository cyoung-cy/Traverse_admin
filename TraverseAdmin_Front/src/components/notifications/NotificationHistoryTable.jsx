import React, { useEffect, useState } from "react";
import { notificationAPI } from "../../utils/api";
import SearchInput from "../common/SearchInput";
import Pagination from "../common/Pagination";
import DateRangePicker from "../common/DateRangePicker";

const PAGE_SIZE = 10;

const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 7);

const NotificationHistoryTable = ({ refetchKey, onSelectNotification }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateRange, setDateRange] = useState({
    start: weekAgo,
    end: today,
  });
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        start_date: dateRange.start
            ? dateRange.start.toISOString().slice(0, 10)
            : undefined,
        end_date: dateRange.end
            ? new Date(dateRange.end.setHours(23, 59, 59, 999))
                .toISOString()
                .slice(0, 10)
            : undefined,
        notification_category:
            selectedCategory !== "ALL" ? selectedCategory : undefined,
      };
      const res = await notificationAPI.getNotificationHistory(params);

      const result = res.data?.data;
      setData(result?.notifications || []);
      setTotalPages(result?.total_pages || 1);
      setTotalCount(result?.total_count || 0);
    } catch (e) {
      setError("알림 발송 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [page, dateRange, refetchKey, selectedCategory]);

  const filtered = data.filter((item) => {
    const category = (item.notification_category || "").toUpperCase();
    const name = item.template_name || item.title || "";
    const sender = item.sent_by || "";

    const matchesCategory =
        selectedCategory === "ALL" || category === selectedCategory;

    const matchesSearch = search
        ? name.toLowerCase().includes(search.toLowerCase()) ||
        sender.toLowerCase().includes(search.toLowerCase())
        : true;

    return matchesCategory && matchesSearch;
  });


  const getCategoryLabel = (category) => {
    switch ((category || "").toUpperCase()) {
      case "SYSTEM":
        return "시스템";
      case "UPDATE":
        return "업데이트";
      case "MAINTENANCE":
        return "점검";
      case "EVENT":
        return "이벤트";
      default:
        return "공지";
    }
  };


  return (
      <div className="p-4 mx-auto max-w-6xl bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
        <div className="flex flex-col mb-14 space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="템플릿명/발송자 검색..."
          />
          <select
              className="px-3 py-2 text-gray-100 bg-gray-900 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">전체 카테고리</option>
            <option value="SYSTEM">시스템</option>
            <option value="UPDATE">업데이트</option>
            <option value="MAINTENANCE">점검</option>
            <option value="EVENT">이벤트</option>
          </select>
          <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={(start, end) => setDateRange({ start, end })}
          />
          <span className="ml-auto text-sm text-gray-400">총 {totalCount}건</span>
        </div>
        <table className="mx-auto w-full max-w-6xl">
          <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">카테고리</th>
            <th className="px-4 py-3 text-left">타입</th>
            <th className="px-4 py-3 text-left">발송일시</th>
            <th className="px-4 py-3 text-left">수신자수</th>
            <th className="px-4 py-3 text-left">읽음수</th>
            <th className="px-4 py-3 text-left">발송자</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-400">
                  로딩 중...
                </td>
              </tr>
          ) : error ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-red-400">
                  {error}
                </td>
              </tr>
          ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-400">
                  발송 내역이 없습니다
                </td>
              </tr>
          ) : (
              filtered.map((item) => (
                  <tr
                      key={item.id}
                      className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                      onClick={() => onSelectNotification?.(item)}
                  >
                    <td className="px-4 py-3 text-gray-300">{item.id}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {getCategoryLabel(item.notification_category)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{item.type}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {item.sent_at
                          ? new Date(item.sent_at).toLocaleString("ko-KR")
                          : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {item.recipient_count || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {item.read_count || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {item.sent_by || "-"}
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
        <div className="py-4">
          <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
          />
        </div>
      </div>
  );
};

export default NotificationHistoryTable;
