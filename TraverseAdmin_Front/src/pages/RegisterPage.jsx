import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../utils/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    invite_code: "",
    email_certification: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInviteCode = async () => {
    if (!formData.invite_code) {
      setError("초대 코드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.validateInviteCode(formData.invite_code);

      if (response.data.success && response.data.data.is_valid) {
        const { role, email } = response.data.data;

        setCodeValidated(true);
        setRole(role);
        setSuccess(response.data.message || `${role} 권한으로 인증되었습니다.`);
        setError("");

        // ✅ 이메일 자동 입력
        setFormData((prev) => ({
          ...prev,
          email: email || "", // null 또는 undefined 대비
        }));
      } else {
        setError("유효하지 않은 초대 코드입니다.");
      }
    } catch (err) {
      setError(
          err.response?.data?.message || "초대 코드 검증 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 비밀번호 확인
    if (formData.password !== formData.password_confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 초대 코드 검증 확인
    if (!codeValidated) {
      setError("초대 코드를 먼저 검증해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register(formData);
      console.log("회원가입 응답:", response);

      if (response.data.success) {
        setSuccess("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 mx-auto w-full max-w-md bg-gray-800 bg-opacity-70 rounded-xl border border-gray-700 shadow-lg backdrop-filter backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-white">
          관리자 회원가입
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="invite_code"
              className="block text-sm font-medium text-gray-300"
            >
              초대 코드 *
            </label>
            <div className="flex mt-1 space-x-2">
              <input
                id="invite_code"
                name="invite_code"
                type="text"
                value={formData.invite_code}
                onChange={handleChange}
                required
                disabled={codeValidated}
                className="block px-4 py-3 w-full text-white bg-gray-700 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                placeholder="초대 코드를 입력하세요"
              />
              <button
                type="button"
                onClick={validateInviteCode}
                disabled={isLoading || codeValidated}
                className={`px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none ${
                  isLoading || codeValidated
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {codeValidated ? "검증됨" : "코드 검증"}
              </button>
            </div>
          </div>

          {codeValidated && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  이름 *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block px-4 py-3 mt-1 w-full text-white bg-gray-700 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  이메일 *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block px-4 py-3 mt-1 w-full text-white bg-gray-700 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  비밀번호 *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block px-4 py-3 mt-1 w-full text-white bg-gray-700 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="password_confirm"
                  className="block text-sm font-medium text-gray-300"
                >
                  비밀번호 확인 *
                </label>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  className="block px-4 py-3 mt-1 w-full text-white bg-gray-700 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "처리 중..." : "회원가입"}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            이미 계정이 있으신가요?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:text-blue-300"
            >
              로그인
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
