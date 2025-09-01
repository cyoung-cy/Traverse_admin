import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Calendar,
  Clock,
  Edit,
  BarChart,
  CheckCircle,
  LogIn,
} from "lucide-react";

const AdminDetailView = ({
  adminData,
  loading,
  error,
  onUpdateRole,
  onUpdateStatus,
  onBack,
  colors,
}) => {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-700 animate-spin border-t-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg">관리자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const roleMap = {
    chief_manager: "최고관리자",
    post_manager: "게시물관리자",
    chat_manager: "채팅관리자",
    user_manager: "사용자관리자",
    data_manager: "데이터관리자",
  };

  const statusText = {
    active: "활성",
    suspended: "정지됨",
    deleted: "삭제됨",
  };

  const statusColors = {
    active: "bg-green-800 text-green-200",
    suspended: "bg-red-800 text-red-200",
    deleted: "bg-gray-700 text-gray-300",
  };

  const handleRoleDialogOpen = () => {
    setNewRole(adminData.role);
    setSelectedPermissions(
      adminData.permissions ? adminData.permissions.map((p) => p.name) : []
    );
    setRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
  };

  const handleStatusDialogOpen = () => {
    setNewStatus(adminData.status);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);

    // 역할에 따른 기본 권한 설정
    const defaultPermissions = {
      chief_manager: [
        "모든 기능 접근 가능",
        "관리자 관리",
        "시스템 설정 변경",
        "사용자 관리",
        "게시물 관리",
        "채팅 관리",
        "해시태그 관리",
        "매칭 알고리즘 설정",
        "활동 로그 조회",
      ],
      post_manager: [
        "게시물 조회",
        "게시물 상태 변경",
        "게시물 신고 처리",
        "해시태그 관리",
        "게시물 통계 조회",
      ],
      chat_manager: [
        "채팅방 조회",
        "채팅방 상태 변경",
        "메시지 상태 변경",
        "채팅 신고 처리",
        "채팅 통계 조회",
      ],
      user_manager: [
        "사용자 조회",
        "사용자 상태 변경",
        "사용자 신고 처리",
        "알림 발송",
        "사용자 통계 조회",
      ],
      data_manager: [
        "통계 대시보드 조회",
        "사용자 통계 조회",
        "게시물 통계 조회",
        "매칭 통계 조회",
        "해시태그 통계 조회",
        "데이터 내보내기",
      ],
    };

    // 선택한 역할에 해당하는 기본 권한으로 변경
    if (defaultPermissions[event.target.value]) {
      setSelectedPermissions(defaultPermissions[event.target.value]);
    }
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSelectAllPermissions = () => {
    const allPermissions = [
      "모든 기능 접근 가능",
      "관리자 관리",
      "시스템 설정 변경",
      "사용자 관리",
      "게시물 관리",
      "채팅 관리",
      "해시태그 관리",
      "매칭 알고리즘 설정",
      "활동 로그 조회",
      "게시물 조회",
      "게시물 상태 변경",
      "게시물 신고 처리",
      "채팅방 조회",
      "채팅방 상태 변경",
      "메시지 상태 변경",
      "채팅 신고 처리",
      "사용자 조회",
      "사용자 상태 변경",
      "사용자 신고 처리",
      "알림 발송",
      "통계 대시보드 조회",
      "사용자 통계 조회",
      "게시물 통계 조회",
      "매칭 통계 조회",
      "해시태그 통계 조회",
      "데이터 내보내기",
    ];
    setSelectedPermissions(allPermissions);
  };

  const handleDeselectAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const confirmRoleChange = () => {
    onUpdateRole(newRole, selectedPermissions);
    setRoleDialogOpen(false);
  };

  const confirmStatusChange = () => {
    onUpdateStatus(newStatus);
    setStatusDialogOpen(false);
  };

  // 로그인 히스토리 포맷팅 함수
  const formatLoginHistory = (history) => {
    if (!history || history.length === 0) {
      return "로그인 기록 없음";
    }
    return history.map((item, index) => (
      <div
        key={index}
        className="pb-2 mb-2 border-b border-gray-700 last:border-0"
      >
        <div className="flex justify-between">
          <span>{new Date(item.login_at).toLocaleString("ko-KR")}</span>
          <span className="text-gray-400">{item.ip_address}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-4">
        <button
          className="flex gap-2 items-center px-4 py-2 text-gray-200 bg-transparent rounded border border-gray-600 hover:bg-gray-700"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> 뒤로 가기
        </button>
      </div>

      <div className="p-6 mb-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col p-4 h-full">
            <h3 className="mb-3 text-xl font-bold">기본 정보</h3>
            <div className="mb-4 border-b border-gray-700"></div>

            <div className="mt-2 space-y-4">
              <div className="flex gap-2 items-center">
                <User size={16} className="text-gray-400" />
                <span className="font-semibold">이름:</span>
                <span>{adminData.name}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Mail size={16} className="text-gray-400" />
                <span className="font-semibold">이메일:</span>
                <span>{adminData.email}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Lock size={16} className="text-gray-400" />
                <span className="font-semibold">역할:</span>
                <span>{roleMap[adminData.role] || adminData.role}</span>
                <button
                  className="flex gap-1 items-center px-2 py-1 ml-2 text-xs text-gray-200 rounded border border-gray-600 hover:bg-gray-700"
                  onClick={handleRoleDialogOpen}
                >
                  <Edit size={12} /> 변경
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-semibold">상태:</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs ${
                    statusColors[adminData.status] ||
                    "bg-gray-700 text-gray-300"
                  }`}
                >
                  {statusText[adminData.status] || adminData.status}
                </span>
                <button
                  className="flex gap-1 items-center px-2 py-1 ml-2 text-xs text-gray-200 rounded border border-gray-600 hover:bg-gray-700"
                  onClick={handleStatusDialogOpen}
                >
                  <Edit size={12} /> 변경
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <Calendar size={16} className="text-gray-400" />
                <span className="font-semibold">생성일:</span>
                <span>
                  {new Date(adminData.created_at).toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <Clock size={16} className="text-gray-400" />
                <span className="font-semibold">마지막 로그인:</span>
                <span>
                  {new Date(adminData.last_login_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Clock size={16} className="text-gray-400" />
                <span className="font-semibold">마지막 업데이트:</span>
                <span>
                  {new Date(adminData.updated_at).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4">
            <h3 className="mb-3 text-xl font-bold">활동 정보</h3>
            <div className="mb-4 border-b border-gray-700"></div>

            <div className="space-y-4">
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <BarChart size={16} className="text-gray-400" />
                  <span className="font-semibold">관리 항목 수</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-sm text-gray-400">사용자 관리</p>
                    <p className="text-xl font-semibold">
                      {adminData.stat_user_actions || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-sm text-gray-400">게시물 관리</p>
                    <p className="text-xl font-semibold">
                      {adminData.stat_post_actions || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-sm text-gray-400">신고 처리</p>
                    <p className="text-xl font-semibold">
                      {adminData.stat_report_actions || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-sm text-gray-400">설정 변경</p>
                    <p className="text-xl font-semibold">
                      {adminData.stat_settings_changes || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="flex gap-2 items-center mb-3 text-xl font-bold">
            <Lock size={18} className="text-gray-400" />
            권한 정보
          </h3>
          <div className="mb-4 border-b border-gray-700"></div>
          <div className="space-y-3">
            {adminData.permissions &&
              adminData.permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-[#2a3147] rounded"
                >
                  <CheckCircle size={16} className="text-indigo-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{permission.name}</p>
                    <p className="text-sm text-gray-400">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="flex gap-2 items-center mb-3 text-xl font-bold">
            <LogIn size={18} className="text-gray-400" />
            최근 로그인 기록
          </h3>
          <div className="mb-4 border-b border-gray-700"></div>
          <div className="space-y-1">
            {adminData.login_history ? (
              formatLoginHistory(adminData.login_history)
            ) : (
              <p className="text-gray-400">로그인 기록 없음</p>
            )}
          </div>
        </div>
      </div>

      {/* 역할 변경 다이얼로그 */}
      {roleDialogOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold">역할 변경</h3>
            <p className="mb-4 text-gray-300">
              '{adminData.name}' 관리자의 역할을 변경합니다.
            </p>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                역할 선택
              </label>
              <select
                className="p-2 pr-10 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzZiNzI4MCIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMjkzIDcuMjkzYTEgMSAwIDAxMS40MTQgMEwxMCAxMC41ODZsNC4yOTMtNC4yOTNhMSAxIDAgMTExLjQxNCAxLjQxNGwtNSA1YS45OTguOTk4IDAgMDEtMS40MTQgMGwtNS01YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_1rem] bg-[length:1rem_1rem]"
                value={newRole}
                onChange={handleRoleChange}
              >
                <option value="chief_manager">최고관리자</option>
                <option value="post_manager">게시물관리자</option>
                <option value="chat_manager">채팅관리자</option>
                <option value="user_manager">사용자관리자</option>
                <option value="data_manager">데이터관리자</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                커스텀 권한 선택 (선택사항)
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleSelectAllPermissions}
                  className="px-2 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  전체 선택
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllPermissions}
                  className="px-2 py-1 text-xs text-gray-200 rounded border border-gray-600 hover:bg-gray-700"
                >
                  전체 해제
                </button>
              </div>
              <div className="overflow-y-auto p-3 max-h-48 bg-gray-900 rounded border border-gray-700">
                <div className="space-y-2">
                  {[
                    "모든 기능 접근 가능",
                    "관리자 관리",
                    "시스템 설정 변경",
                    "사용자 관리",
                    "게시물 관리",
                    "채팅 관리",
                    "해시태그 관리",
                    "매칭 알고리즘 설정",
                    "활동 로그 조회",
                    "게시물 조회",
                    "게시물 상태 변경",
                    "게시물 신고 처리",
                    "채팅방 조회",
                    "채팅방 상태 변경",
                    "메시지 상태 변경",
                    "채팅 신고 처리",
                    "사용자 조회",
                    "사용자 상태 변경",
                    "사용자 신고 처리",
                    "알림 발송",
                    "통계 대시보드 조회",
                    "사용자 통계 조회",
                    "게시물 통계 조회",
                    "매칭 통계 조회",
                    "해시태그 통계 조회",
                    "데이터 내보내기",
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        id={`permission-${index}`}
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                      />
                      <label
                        htmlFor={`permission-${index}`}
                        className="ml-2 text-sm text-gray-300"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 text-gray-200 rounded border border-gray-600 hover:bg-gray-700"
                onClick={handleRoleDialogClose}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                onClick={confirmRoleChange}
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상태 변경 다이얼로그 */}
      {statusDialogOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold">상태 변경</h3>
            <p className="mb-4 text-gray-300">
              '{adminData.name}' 관리자의 상태를 변경합니다.
            </p>
            <div className="mb-4">
              <select
                className="p-2 pr-10 w-full text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzZiNzI4MCIgYXJpYS1oaWRkZW49InRydWUiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMjkzIDcuMjkzYTEgMSAwIDAxMS40MTQgMEwxMCAxMC41ODZsNC4yOTMtNC4yOTNhMSAxIDAgMTExLjQxNCAxLjQxNGwtNSA1YS45OTguOTk4IDAgMDEtMS40MTQgMGwtNS01YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_1rem] bg-[length:1rem_1rem]"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="active">활성</option>
                <option value="suspended">정지</option>
                <option value="deleted">삭제됨</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 text-gray-200 rounded border border-gray-600 hover:bg-gray-700"
                onClick={handleStatusDialogClose}
              >
                취소
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  newStatus === "suspended"
                    ? "bg-red-600 hover:bg-red-700"
                    : newStatus === "deleted"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={confirmStatusChange}
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetailView;
