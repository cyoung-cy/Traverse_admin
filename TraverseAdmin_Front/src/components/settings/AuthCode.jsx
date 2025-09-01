import { useState } from "react";
import { authAPI } from "../../utils/api";

const AuthCode = () => {
  const [authCode, setAuthCode] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null });

  const roles = [
    { value: "chief_manager", label: "최고관리자" },
    { value: "post_manager", label: "게시물관리자" },
    { value: "chat_manager", label: "채팅관리자" },
    { value: "user_manager", label: "사용자관리자" },
    { value: "data_manager", label: "데이터관리자" },
  ];

  const generateAuthCode = async () => {
    setStatus({ loading: true, error: null });
    try {
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 24); // 24시간 후 만료
      console.log("전송할 email:", email);
      console.log("전송할 role:", role);

      // API 요청
      const response = await authAPI.generateInviteCode({
        email,
        role,
        time_stamp: new Date().toISOString(),
      });

      // 응답에서 code 추출
      if (response.data.success) {
        setAuthCode(response.data.data.code); // 응답에서 code 설정
      } else {
        setStatus({ loading: false, error: response.data.message });
      }

      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({
        loading: false,
        error: "인증 코드 생성 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="p-6 mb-6 h-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
      <h2 className="mb-4 text-xl font-bold text-white">관리자 인증 코드</h2>
      <div className="gap-4 items-center">
        <div className="flex items-center mb-4">
          <div className="flex gap-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-48 text-white bg-gray-700 rounded-md"
              placeholder="이메일"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 w-48 text-white bg-gray-700 rounded-md"
            >
              <option value="">역할 선택</option>
              {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
              ))}
            </select>


          </div>
          <div className="mr-8 ml-auto">
            <button
                onClick={generateAuthCode}
                disabled={status.loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800"
            >
              {status.loading ? "생성 중..." : "인증 코드 생성"}
            </button>
          </div>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            value={authCode}
            readOnly
            className="px-4 py-2 w-[408px] text-white bg-gray-700 rounded-md"
            placeholder="인증 코드"
          />
        </div>
        {status.error && <p className="text-sm text-red-500">{status.error}</p>}
        <p className="text-sm text-gray-400">
          생성된 인증 코드는 새로운 관리자 회원가입 시 필요합니다.
        </p>
      </div>
    </div>
  );
};

export default AuthCode;
