import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        // 토큰 및 사용자 정보 저장
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userId", response.data.data.admin_id);
        localStorage.setItem("userName", response.data.data.name);
        localStorage.setItem("userRole", response.data.data.role);

        // 대시보드로 이동
        navigate("/");
      } else {
        setError(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 mx-auto rounded-xl bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg border border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-white">
          관리자 로그인
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="your-email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            계정이 없으신가요?{" "}
            <a
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              회원가입
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
