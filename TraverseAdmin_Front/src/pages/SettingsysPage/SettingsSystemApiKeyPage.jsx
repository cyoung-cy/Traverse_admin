import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { settingsAPI } from "../../utils/api";
import { motion } from "framer-motion";
import { Plus, Trash2, Copy } from "lucide-react";

export default function SettingsSystemApiKeyPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    permissions: "",
    expires_in: 30,
  });
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState(null); // 생성 후 전체 키 노출용
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // API 키 목록 조회
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getApiKeys();
      if (res.success) {
        setApiKeys(res.data.keys);
      } else {
        setError(res.message || "API 키 목록을 불러오지 못했습니다.");
      }
    } catch (e) {
      setError("API 키 목록 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // 키 생성
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const permissions = createForm.permissions
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      const res = await settingsAPI.createApiKey({
        name: createForm.name,
        permissions,
        expires_in: Number(createForm.expires_in),
      });
      if (res.success) {
        setNewKey(res.data); // 전체 키 노출
        setShowCreateModal(false);
        setCreateForm({ name: "", permissions: "", expires_in: 30 });
        fetchApiKeys();
      } else {
        setError(res.message || "API 키 생성에 실패했습니다.");
      }
    } catch (e) {
      setError("API 키 생성 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  };

  // 키 삭제
  const handleDelete = async (id) => {
    setDeleting(true);
    setError("");
    try {
      const res = await settingsAPI.deleteApiKey(id);
      if (res.success) {
        setDeleteId(null);
        fetchApiKeys();
      } else {
        setError(res.message || "API 키 삭제에 실패했습니다.");
      }
    } catch (e) {
      setError("API 키 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 키 복사
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    alert("클립보드에 복사되었습니다.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header title="시스템 설정 - API 키" />
      <main className="flex-1 px-2 py-4 mx-auto w-full lg:px-8">
        <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">API 키 관리</h2>
            <button
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} className="mr-1" /> 새 API 키 생성
            </button>
          </div>
          {error && <div className="mb-4 text-red-400">{error}</div>}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 animate-spin border-t-transparent"></div>
              <span className="ml-2 text-gray-300">로딩 중...</span>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              API 키가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-gray-200 border-collapse">
                <thead>
                  <tr className="bg-gray-800 bg-opacity-60">
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      이름
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      Prefix
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      생성일
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      만료일
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      마지막 사용
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      생성자
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      권한
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-700">
                      삭제
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-gray-700">
                      <td className="px-4 py-3 break-all">{key.name}</td>
                      <td className="px-4 py-3 font-mono break-all">
                        {key.prefix}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(key.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {key.expires_at
                          ? new Date(key.expires_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 break-all">{key.created_by}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {key.permissions && key.permissions.length > 0
                            ? key.permissions.map((perm, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-1 text-xs bg-gray-700 rounded"
                                >
                                  {perm}
                                </span>
                              ))
                            : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="p-1 text-red-400 hover:text-red-600"
                          onClick={() => setDeleteId(key.id)}
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 모달들을 main 바깥, 페이지 전체 바로 아래에 위치 */}
      {showCreateModal && (
        <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-start pt-16 pb-8 bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 w-full max-w-md bg-gray-900 rounded-lg border border-gray-700 shadow-lg"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <h3 className="mb-4 text-lg font-bold text-white">
              새 API 키 생성
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-300">이름</label>
                <input
                  type="text"
                  className="px-3 py-2 w-full text-white bg-gray-800 rounded border border-gray-600"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  권한 (콤마로 구분)
                </label>
                <input
                  type="text"
                  className="px-3 py-2 w-full text-white bg-gray-800 rounded border border-gray-600"
                  value={createForm.permissions}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      permissions: e.target.value,
                    })
                  }
                  placeholder="예: read,write,delete"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  만료 기간 (일)
                </label>
                <input
                  type="number"
                  min="1"
                  className="px-3 py-2 w-full text-white bg-gray-800 rounded border border-gray-600"
                  value={createForm.expires_in}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, expires_in: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  disabled={creating}
                >
                  {creating ? "생성 중..." : "생성"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {newKey && (
        <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-start pt-16 pb-8 bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 w-full max-w-md text-center bg-gray-900 rounded-lg border border-gray-700 shadow-lg"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <h3 className="mb-4 text-lg font-bold text-white">
              API 키가 생성되었습니다
            </h3>
            <div className="mb-2 text-gray-300">
              이 키는 <b>한 번만</b> 표시됩니다. 반드시 복사해 두세요.
            </div>
            <div className="flex justify-center items-center p-3 mb-4 bg-gray-800 rounded">
              <span className="font-mono text-lg text-blue-400 select-all">
                {newKey.key}
              </span>
              <button
                className="p-1 ml-2 text-gray-400 hover:text-blue-400"
                onClick={() => handleCopy(newKey.key)}
                title="복사"
              >
                <Copy size={18} />
              </button>
            </div>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => setNewKey(null)}
            >
              확인
            </button>
          </motion.div>
        </div>
      )}
      {deleteId && (
        <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-start pt-16 pb-8 bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 w-full max-w-md text-center bg-gray-900 rounded-lg border border-gray-700 shadow-lg"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <h3 className="mb-4 text-lg font-bold text-white">API 키 삭제</h3>
            <div className="mb-4 text-gray-300">
              정말로 이 API 키를 삭제하시겠습니까?
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <button
                className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
