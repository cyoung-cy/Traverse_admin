import React, { useEffect, useState } from "react";
import { notificationAPI } from "../../utils/api";
import SearchInput from "../common/SearchInput";
import Pagination from "../common/Pagination";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 10;

// ConfirmModal 임시 구현 (실제 파일 분리 권장)
function ConfirmModal({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-40">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl min-w-[300px]">
        <div className="mb-4 text-center text-gray-100">{message}</div>
        <div className="flex gap-2 justify-center">
          <button
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            삭제
          </button>
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

const NotificationTable = ({ onEdit }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingId, setSendingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationAPI.getNotificationTemplates();
      const data = res.data?.templates || [];
      setTemplates(data.filter((tpl) => tpl.type === "announcement"));
    } catch (e) {
      setError("알림 템플릿을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 검색/페이지네이션 적용된 템플릿 목록
  const filtered = templates.filter(
    (tpl) => tpl.name.includes(search) || tpl.content.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 검색어 변경 시 1페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 삭제
  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await notificationAPI.deleteNotificationTemplate(deleteId);
      toast.success("삭제되었습니다.");
      fetchTemplates();
    } catch (e) {
      toast.error("삭제 중 오류 발생");
    } finally {
      setDeleteId(null);
    }
  };

  // 수정
  const handleEdit = (template) => {
    if (onEdit) onEdit(template);
  };

  // 전송
  const handleSend = async (template) => {
    setSendingId(template.id);
    try {
      await notificationAPI.sendNotification({
        template_id: template.id,
        recipients: ["all"],
      });
      toast.success("전송되었습니다.");
    } catch (e) {
      toast.error("전송 중 오류 발생");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
      <div className="flex justify-between items-center p-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="제목/내용 검색..."
        />
        <span className="text-sm text-gray-400">총 {filtered.length}건</span>
      </div>
      <table className="mx-auto w-full max-w-4xl">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">제목</th>
            <th className="px-4 py-3 text-left">내용</th>
            <th className="px-4 py-3 text-left">생성일</th>
            <th className="px-4 py-3 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-400">
                로딩 중...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-red-400">
                {error}
              </td>
            </tr>
          ) : paged.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-400">
                전체 공지 템플릿이 없습니다
              </td>
            </tr>
          ) : (
            paged.map((template) => (
              <tr
                key={template.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="px-4 py-3 text-gray-300">{template.id}</td>
                <td className="px-4 py-3 text-gray-300">{template.name}</td>
                <td className="px-4 py-3 text-gray-300">{template.content}</td>
                <td className="px-4 py-3 text-gray-300">
                  {template.created_at
                    ? new Date(template.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="flex gap-2 px-4 py-3">
                  <button
                    className="px-2 py-1 text-xs text-white bg-blue-700 rounded hover:bg-blue-800"
                    onClick={() => handleEdit(template)}
                  >
                    수정
                  </button>
                  <button
                    className="px-2 py-1 text-xs text-white bg-red-700 rounded hover:bg-red-800"
                    onClick={() => handleDelete(template.id)}
                  >
                    삭제
                  </button>
                  <button
                    className="px-2 py-1 text-xs text-white bg-green-700 rounded hover:bg-green-800 disabled:opacity-50"
                    onClick={() => handleSend(template)}
                    disabled={sendingId === template.id}
                  >
                    {sendingId === template.id ? "전송 중..." : "전송"}
                  </button>
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
      <ConfirmModal
        open={!!deleteId}
        message="정말 삭제하시겠습니까?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default NotificationTable;
