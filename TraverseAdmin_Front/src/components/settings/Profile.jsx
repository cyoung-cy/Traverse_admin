import { useEffect, useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { adminAPI } from "../../utils/api";
import { setMockAdminProfile } from "../../utils/mockApi";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // mock 환경에서 localStorage에 mock 관리자 정보 자동 세팅
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      setMockAdminProfile();
    }
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!admin) return <div>관리자 정보가 없습니다.</div>;

  return (
    <SettingSection icon={User} title={"프로필"}>
      <div className="flex flex-col items-center p-6 mb-6 h-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 sm:flex-row">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{admin.name}</h3>
          <p className="text-gray-400">{admin.admin_id}</p>
          <p className="text-gray-400">{admin.role}</p>
        </div>
      </div>
    </SettingSection>
  );
};
export default Profile;
