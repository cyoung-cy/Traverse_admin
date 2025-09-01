import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminDetailView from "../../components/admin/AdminDetailView";
import { adminAPI } from "../../utils/api";
import Header from "../../components/common/Header";

// 테마 색상 정의
const colors = {
  primary: "#141b2d",
  secondary: "#4cceac",
  accent: "#6870fa",
  blueAccent: {
    700: "#3e4396",
  },
};

const AdminDetailPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { adminId } = useParams(); // useParams()에서 undefined 반환 가능

  useEffect(() => {
    console.log("adminId:", adminId); // adminId 값 확인

    if (!adminId) {
      setError("관리자 ID가 유효하지 않습니다");
      return;
    }

    const fetchAdminDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminAPI.getAdminDetail(adminId);
        console.log("관리자 상세 정보 API 응답:", response);

        //수정됨
        if (response.data) {
          setAdminData(response.data);
          fetchAdminDetail;
        } else {
          setError(response.error || "관리자 정보를 불러오는데 실패했습니다");
        }
      } catch (err) {
        console.error("관리자 상세 정보 API 오류:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "관리자 정보를 불러오는데 실패했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchAdminDetail();
    } else {
      setError("관리자 ID가 유효하지 않습니다");
    }
  }, [adminId]);

  // 성공 메시지 표시 후 3초 후에 제거하는 효과
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleUpdateRole = async (role, permissions) => {
    setLoading(true);
    setError(null);

    try {
      // 권한을 객체 형태로 변환
      const permissionsObj = permissions.map((permissionName) => ({
        name: permissionName,
        description: `${permissionName} 권한`,
      }));

      const response = await adminAPI.updateAdminRole(adminId, {
        role,
        permissions: permissionsObj,
      });
      console.log("역할 변경 API 응답:", response);

      if (response.success) {
        setSuccessMessage("관리자 역할이 성공적으로 변경되었습니다");

        // 역할 업데이트 후 데이터 다시 로드
        try {
          const updatedResponse = await adminAPI.getAdminDetail(adminId);
          console.log("역할 변경 후 상세 정보 API 응답:", updatedResponse);

          if (updatedResponse.success) {
            setAdminData({
              ...updatedResponse.data,
              // 백엔드에서 권한 정보를 올바르게 반환하지 않는 경우를 대비해
              // 프론트엔드에서도 권한 정보를 설정
              permissions:
                updatedResponse.data.permissions &&
                updatedResponse.data.permissions.length > 0
                  ? updatedResponse.data.permissions
                  : permissionsObj,
            });
          } else {
            setError(
              updatedResponse.error ||
                "업데이트된 관리자 정보를 불러오는데 실패했습니다"
            );
          }
        } catch (refreshErr) {
          console.error("업데이트 후 상세 정보 API 오류:", refreshErr);
          setError(
            refreshErr.response?.data?.message ||
              refreshErr.message ||
              "업데이트된 관리자 정보를 불러오는데 실패했습니다"
          );
        }
      } else {
        setError(response.error || "역할 변경에 실패했습니다");
      }
    } catch (err) {
      console.error("역할 변경 API 오류:", err);
      setError(
        err.response?.data?.message || err.message || "역할 변경에 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.updateAdminStatus(adminId, { status });
      console.log("상태 변경 API 응답:", response);

      if (response.success) {
        setSuccessMessage("관리자 상태가 성공적으로 변경되었습니다");

        // 상태 업데이트 후 데이터 다시 로드
        try {
          const updatedResponse = await adminAPI.getAdminDetail(adminId);
          console.log("상태 변경 후 상세 정보 API 응답:", updatedResponse);

          if (updatedResponse.success) {
            setAdminData(updatedResponse.data);
          } else {
            setError(
              updatedResponse.error ||
                "업데이트된 관리자 정보를 불러오는데 실패했습니다"
            );
          }
        } catch (refreshErr) {
          console.error("업데이트 후 상세 정보 API 오류:", refreshErr);
          setError(
            refreshErr.response?.data?.message ||
              refreshErr.message ||
              "업데이트된 관리자 정보를 불러오는데 실패했습니다"
          );
        }
      } else {
        setError(response.error || "상태 변경에 실패했습니다");
      }
    } catch (err) {
      console.error("상태 변경 API 오류:", err);
      setError(
        err.response?.data?.message || err.message || "상태 변경에 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/admins");
  };

  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="관리자 상세 정보" />

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="mt-10">
        <AdminDetailView
          adminData={adminData}
          loading={loading}
          error={error}
          onUpdateRole={handleUpdateRole}
          onUpdateStatus={handleUpdateStatus}
          onBack={handleBack}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default AdminDetailPage;
