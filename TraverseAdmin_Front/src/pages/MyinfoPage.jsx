import { useEffect, useState } from "react";
import { User, Mail, Lock, Calendar, Clock } from "lucide-react";
import Header from "../components/common/Header";
import AuthCode from "../components/settings/AuthCode";
import { adminAPI } from "../utils/api";

const roleMap = {
  chief_manager: "최고관리자",
  post_manager: "게시물관리자",
  chat_manager: "채팅관리자",
  user_manager: "사용자관리자",
  data_manager: "데이터관리자",
};

const MyinfoPage = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminId = localStorage.getItem("admin_id");
    if (!adminId) {
      setError("로그인 정보가 없습니다.");
      setLoading(false);
      return;
    }
    adminAPI
      .getAdminDetail(adminId)
      .then((res) => setAdmin(res.data))
      .catch(() => setError("관리자 정보를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-auto relative z-10 flex-1 bg-gray-900">
      <Header title="마이페이지" />
      <main className="px-4 py-6 mx-auto max-w-4xl lg:px-8">
        <AuthCode />

        {/* 관리자 기본 정보 */}
        <div className="p-6 mb-6 h-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
          <h3 className="mb-3 text-xl font-bold">기본 정보</h3>
          <div className="mb-4 border-b border-gray-700"></div>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : admin ? (
            <div className="mt-2 space-y-4">
              <div className="flex gap-2 items-center">
                <User size={16} className="text-gray-400" />
                <span className="font-semibold">이름:</span>
                <span>{admin.name}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={16} className="text-gray-400" />
                <span className="font-semibold">이메일:</span>
                <span>{admin.email}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Lock size={16} className="text-gray-400" />
                <span className="font-semibold">역할:</span>
                <span>{roleMap[admin.role] || admin.role}</span>
              </div>
              {admin.created_at && (
                <div className="flex gap-2 items-center">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-semibold">생성일:</span>
                  <span>
                    {new Date(admin.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>
              )}
              {admin.last_login_at && (
                <div className="flex gap-2 items-center">
                  <Clock size={16} className="text-gray-400" />
                  <span className="font-semibold">마지막 로그인:</span>
                  <span>
                    {new Date(admin.last_login_at).toLocaleString("ko-KR")}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default MyinfoPage;
