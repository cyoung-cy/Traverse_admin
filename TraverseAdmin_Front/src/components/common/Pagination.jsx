import React from "react";
import { toast } from "react-toastify";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 번호 생성 (현재 페이지 주변의 페이지만 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 최대 표시할 페이지 수
    const sidePages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 표시되는 페이지의 수가 maxPagesToShow보다 작으면 시작 페이지 조정
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 페이지 직접 입력 기능
  const [inputPage, setInputPage] = React.useState("");
  const handleInputChange = (e) => {
    // 숫자만 허용
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputPage(value);
  };
  const handlePageJump = () => {
    const pageNum = Number(inputPage);
    if (
      !pageNum ||
      pageNum < 1 ||
      pageNum > totalPages ||
      !Number.isInteger(pageNum)
    ) {
      toast.error("존재하지 않는 페이지입니다");
      setInputPage("");
      return;
    }
    onPageChange(pageNum);
    setInputPage("");
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageJump();
    }
  };

  // if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <nav className="flex items-center space-x-1">
        {/* 처음 페이지로 이동 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          &laquo;
        </button>

        {/* 이전 페이지로 이동 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          &lsaquo;
        </button>

        {/* 페이지 번호들 */}
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-blue-600 text-white"
                : "text-white hover:bg-gray-700"
            }`}
          >
            {number}
          </button>
        ))}

        {/* 다음 페이지로 이동 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          &rsaquo;
        </button>

        {/* 마지막 페이지로 이동 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          &raquo;
        </button>

        {/* 페이지 직접 입력 */}
        <div className="flex items-center ml-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="페이지 수"
            className="px-2 py-1 ml-2 w-16 text-center text-white bg-gray-800 rounded-md border border-gray-600 appearance-none focus:outline-none focus:border-blue-500"
            style={{ MozAppearance: "textfield" }}
          />
          <button
            onClick={handlePageJump}
            className="px-2 py-1 ml-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            이동
          </button>
        </div>
      </nav>
      {/* 스핀 버튼 제거 스타일 */}
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Pagination;
