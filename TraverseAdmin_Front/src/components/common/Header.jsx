import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "사용자");
    }
  }, []);

  const handleLogin = () => {
    // 로그인 페이지로 이동
    navigate("/login");
  };

  const handleLogout = () => {
    // 로그아웃 처리
    setIsLoggedIn(false);
    setUserName("");
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("token");
    // 홈으로 이동
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 border-b border-gray-700 shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center px-3 py-3 mx-auto max-w-5xl sm:px-5 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-100">{title}</h1>
        <div className="flex gap-3 items-center">
          {isLoggedIn && (
            <span className="text-gray-300">{userName}님 환영합니다</span>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 font-bold text-white bg-red-600 rounded hover:bg-red-700 text-sm"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 text-sm"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
