import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { FileText, Trash2, PlusCircle } from "lucide-react";
import { settingsAPI } from "../../utils/api";
import { toast } from "react-toastify";

const SettingBannedWordsPage = () => {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const pageSize = 10;

  // 금지어 목록 불러오기
  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getBannedWords();
      if (res.success) {
        setWords(res.data.words);
        setLastUpdated(res.data.last_updated);
        setUpdatedBy(res.data.updated_by);
      }
    } catch (e) {
      toast.error("금지어 목록을 불러오지 못했습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // 금지어 추가
  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await settingsAPI.updateBannedWords([input.trim()], "add");
      if (res.success) {
        toast.success("금지어가 추가되었습니다.");
        setInput("");
        fetchWords();
      }
    } catch (e) {
      toast.error("금지어 추가에 실패했습니다.");
    }
    setLoading(false);
  };

  // 금지어 삭제
  const handleRemove = async (word) => {
    setLoading(true);
    try {
      const res = await settingsAPI.updateBannedWords([word], "remove");
      if (res.success) {
        toast.success("금지어가 삭제되었습니다.");
        fetchWords();
      }
    } catch (e) {
      toast.error("금지어 삭제에 실패했습니다.");
    }
    setLoading(false);
  };

  // 검색 + 페이지네이션 처리
  const filteredWords = words.filter((w) =>
    w.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / pageSize));
  const pagedWords = filteredWords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 검색 입력 시 페이지 1로 이동
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // 체크박스 선택/해제 핸들러
  const handleSelectWord = (word) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (pagedWords.every((word) => selectedWords.includes(word))) {
      setSelectedWords((prev) => prev.filter((w) => !pagedWords.includes(w)));
    } else {
      setSelectedWords((prev) => [
        ...prev,
        ...pagedWords.filter((w) => !prev.includes(w)),
      ]);
    }
  };

  // 선택된 금지어 일괄 삭제
  const handleRemoveSelected = async () => {
    if (selectedWords.length === 0) return;
    setLoading(true);
    try {
      const res = await settingsAPI.updateBannedWords(selectedWords, "remove");
      if (res.success) {
        toast.success("선택한 금지어가 삭제되었습니다.");
        setSelectedWords([]);
        fetchWords();
      }
    } catch (e) {
      toast.error("선택한 금지어 삭제에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="금지어 관리" />
      <main className="px-2 py-4 mx-auto w-full lg:px-32">
        {/* 금지어 추가 카드 */}
        <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg shadow">
            <div className="flex gap-2 items-center mb-2">
              <FileText className="text-lg font-bold text-blue-500" />
              <span className="text-lg font-bold text-white">금지어 추가</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-2 py-1 text-black rounded border"
                placeholder="금지어 입력"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
              <button
                className="flex gap-1 items-center px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleAdd}
                disabled={loading}
              >
                <PlusCircle size={18} />
                추가
              </button>
            </div>
          </div>
        </div>
        {/* 금지어 목록 카드 */}
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <div className="flex gap-2 items-center mb-4">
            <FileText className="text-lg font-bold text-blue-500" />
            <span className="text-lg font-bold text-white">금지어 목록</span>
            <span className="ml-2 text-sm text-gray-400">
              {filteredWords.length}개
            </span>
            <div className="flex items-center ml-auto">
              {!selectMode ? (
                <button
                  className="flex gap-1 items-center px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => setSelectMode(true)}
                  disabled={loading}
                >
                  선택
                </button>
              ) : (
                <>
                  <button
                    className="flex gap-1 items-center px-3 py-1 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedWords([]);
                    }}
                    disabled={loading}
                  >
                    선택 해제
                  </button>
                  <button
                    className="flex gap-1 items-center px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
                    onClick={handleRemoveSelected}
                    disabled={loading || selectedWords.length === 0}
                  >
                    <Trash2 size={18} />
                    선택 삭제
                  </button>
                </>
              )}
            </div>
          </div>
          {lastUpdated && (
            <div className="mb-2 text-xs text-gray-400">
              마지막 수정: {new Date(lastUpdated).toLocaleString()} / by{" "}
              {updatedBy}
            </div>
          )}
          {/* 검색창 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 px-2 py-1 text-black rounded border"
              placeholder="금지어 검색"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {loading ? (
            <div className="text-white">로딩 중...</div>
          ) : (
            <>
              <ul className="divide-y divide-gray-700">
                {selectMode && (
                  <li className="flex items-center py-2 border-b border-gray-700">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={
                        pagedWords.length > 0 &&
                        pagedWords.every((word) => selectedWords.includes(word))
                      }
                      onChange={handleSelectAll}
                      disabled={pagedWords.length === 0}
                    />
                    <span className="text-sm text-gray-300">전체 선택</span>
                  </li>
                )}
                {pagedWords.length === 0 && (
                  <li className="py-2 text-gray-400">검색 결과가 없습니다.</li>
                )}
                {pagedWords.map((word) => (
                  <li
                    key={word}
                    className="flex justify-between items-center py-2 group"
                  >
                    <div className="flex items-center">
                      {selectMode && (
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedWords.includes(word)}
                          onChange={() => handleSelectWord(word)}
                          disabled={loading}
                        />
                      )}
                      <span className="text-white">{word}</span>
                    </div>
                    <button
                      className="flex gap-1 items-center text-xs text-red-400 opacity-70 hover:text-red-200 group-hover:opacity-100"
                      onClick={() => handleRemove(word)}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
              {/* 페이지네이션 */}
              <div className="flex gap-2 justify-center items-center mt-4">
                <button
                  className="px-2 py-1 text-sm text-white bg-gray-700 rounded disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <span className="text-sm text-gray-300">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="px-2 py-1 text-sm text-white bg-gray-700 rounded disabled:opacity-50"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingBannedWordsPage;
