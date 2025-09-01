import axios from "axios";
import {
  mockUserAPI,
  mockReportsAPI,
  mockNotificationAPI,
  mockAuthAPI,
  mockHashtagAPI,
  mockChatAPI,
  mockPostAPI,
  mockMatchingAPI,
  mockAdminAPI,
  mockDashboardAPI,
  mockSettingsAPI,
  mockReportsAnalyticsAPI,
  mockInquiriesAPI,
  mockSnapAPI,
} from "./mockApi";

// .env 파일에서 정의된 BASE_URL을 사용합니다
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockAuthAPI
    : {
        // 로그인
        login: (credentials) => {
          return api.post("/api/auth/login", credentials);
        },

        // 회원가입
        register: (userData) => {
          return api.post("/api/auth/register", userData);
        },

        // 초대 코드 생성
        generateInviteCode: (data) => {
          // 명세에 맞게 데이터 형식 맞춤 (email, role, time_stamp)
          return api.post("/api/auth/invite-code/generate", data);
        },

        // 초대 코드 검증
        validateInviteCode: (code) => {
          // 명세에 맞게 code 파라미터 전달
          return api.post("/api/auth/invite-code/validate", { code });
        },
      };

// 사용자 관리 API
export const userAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockUserAPI
    : {
        // 사용자 목록 조회
        getUsers: (params) => {
          return api.get("/api/users", { params });
        },

        // 사용자 상세 정보 조회
        getUserDetail: (userId) => {
          return api.get(`/api/users/${userId}`);
        },

        // 사용자 계정 상태 변경
        updateUserStatus: (userId, statusData) => {
          return api.patch(`/api/users/${userId}/status`, statusData);
        },

        // 사용자 통계 대시보드 데이터
        getUserStatistics: (params) => {
          return api.get("/api/users/statistics", { params });
        },

        // 사용자 탈퇴 사유 통계
        getWithdrawalReasons: (params) => {
          return api.get("/api/users/withdrawal-reasons", { params });
        },
      };

// 신고 관리 authAPI
export const reportsAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockReportsAPI
    : {
        // 사용자 신고 목록 조회
        getReportsUsers: (params) => {
          return api.get("/api/reports/users", { params });
        },

        // 게시물 신고 목록 조회
        getReportsPosts: (params) => {
          return api.get("/api/reports/posts", { params });
        },

        // 채팅 신고 목록 조회
        getReportsChats: (params) => {
          return api.get("/api/reports/chats", { params });
        },

        // 신고 처리
        processReport: async (reportId, data) => {
          try {
            const response = await api.patch(
              `/api/reports/${reportId}/process`,
              data
            );
            return response.data;
          } catch (error) {
            throw error;
          }
        },

        // 신고 상세 조회
        getReportDetail: (reportId) => {
          return api.get(`/api/reports/${reportId}`);
        },

        // 스냅 신고 목록 조회
        getReportsSnaps: (params) => {
          return api.get("/api/reports/snaps", { params });
        },

        // 댓글 신고 목록 조회
        getReportsComments: (params) => {
          return api.get("/api/reports/comments", { params });
        },
      };

// 해시태그 관리 API
export const hashtagAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockHashtagAPI
    : {
        // 해시태그 목록 조회
        getHashtags: (params) => {
          return api.get("/api/hashtags", { params });
        },

        // 해시태그 상세 조회
        getHashtagDetail: (hashtagId) => {
          return api.get(`/api/hashtags/${hashtagId}`);
        },

        // 해시태그 워드 클라우드 데이터
        getWordcloud: (params) => {
          return api.get("/api/hashtags/wordcloud", { params });
        },

        // 해시태그 상태 변경
        updateHashtagStatus: (hashtagId, statusData) => {
          return api.patch(`/api/hashtags/${hashtagId}/status`, statusData);
        },

        // 해시태그 통계 대시보드
        getHashtagStatistics: (params) => {
          return api.get("/api/hashtags/statistics", { params });
        },
      };

// 알림 관리 API
export const notificationAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockNotificationAPI
    : {
        // 알림 템플릿 목록 조회
        getNotificationTemplates: (params) => {
          return api.get("/api/notifications/templates", { params });
        },

        // 알림 템플릿 생성/수정
        saveNotificationTemplate: (templateData) => {
          const method = templateData.id ? "put" : "post";
          return api[method]("/api/notifications/templates", templateData);
        },

        // 알림 발송
        sendNotification: (notificationData) => {
          return api.post("/api/notifications/send", notificationData);
        },

        // 알림 발송 내역 조회
        getNotificationHistory: (params) => {
          return api.get("/api/notifications/history", { params });
        },

        // 알림 템플릿 삭제
        deleteNotificationTemplate: (templateId) => {
          return api.delete(`/api/notifications/templates/${templateId}`);
        },
      };

// 채팅 관리 API
export const chatAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockChatAPI
    : {
        // 채팅방 목록 조회
        getChatRooms: (params) => {
          return api.get("/api/chats/rooms", { params });
        },

        // 채팅방 상세 조회
        getChatRoomDetail: (roomId, params) => {
          return api
            .get(`/api/chats/rooms/${roomId}`, { params })
            .then((res) => res.data) // ✅ 여기서 .data 추출!
            .catch((err) => {
              console.error("채팅방 상세 조회 API 오류:", err);
              return null;
            });
        },

        // 채팅방 상태 변경
        updateChatRoomStatus: (roomId, statusData) => {
          return api.patch(`/api/chats/rooms/${roomId}/status`, statusData);
        },

        // 채팅 메시지 관리 - 함수명 수정
        updateChatMessageStatus: (messageId, statusData) => {
          return api.patch(
            `/api/chats/messages/${messageId}/status`,
            statusData
          );
        },
      };

// 게시물 관리 API
export const postAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockPostAPI
    : {
        // 게시물 목록 조회
        getPosts: (params) => {
          return api.get("/api/posts", { params });
        },

        // 게시물 상세 조회
        getPostDetail: (postId) => {
          return api.get(`/api/posts/${postId}`);
        },

        // 게시물 상태 변경
        updatePostStatus: (postId, statusData) => {
          return api.patch(`/api/posts/${postId}/status`, statusData);
        },

        // 게시물 통계 대시보드 데이터
        getPostStatistics: (params) => {
          return api.get("/api/posts/statistics", { params });
        },

        // 게시물 신고 검토 대기 목록
        getPendingReviews: (params) => {
          return api.get("/api/posts/pending-reviews", { params });
        },

        // 게시물 검토 승인/거부
        reviewPost: (postId, reviewData) => {
          return api.patch(`/api/posts/${postId}/review`, reviewData);
        },
      };

// 매칭 시스템 관리 API
export const matchingAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockMatchingAPI
    : {
        // 매칭 알고리즘 설정 조회
        getMatchingSettings: () => {
          return api.get("/api/matching/settings");
        },

        // 매칭 알고리즘 설정 업데이트
        updateMatchingSettings: (settingsData) => {
          return api.put("/api/matching/settings", settingsData);
        },

        // 매칭 통계 조회
        getMatchingStatistics: (params) => {
          return api.get("/api/matching/statistics", { params });
        },

        // 매칭 히스토리 조회
        getMatchingHistory: (params) => {
          return api.get("/api/matching/history", { params });
        },

        // 매칭 상세 조회
        getMatchDetail: (matchId) => {
          return api.get(`/api/matching/${matchId}`);
        },
      };

// 관리자 관리 API
export const adminAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockAdminAPI
    : {
        // 관리자 목록 조회
        getAdmins: (params) => {
          return api.get("/api/auth/admins", { params });
        },

        // 관리자 상세 조회
        getAdminDetail: (adminId) => {
          return api.get(`/api/auth/admins/${adminId}`);
        },

        // 관리자 역할 및 권한 변경
        updateAdminRole: (adminId, roleData) => {
          return api.patch(`/api/admins/${adminId}/role`, roleData);
        },

        // 관리자 상태 변경
        updateAdminStatus: (adminId, statusData) => {
          return api.patch(`/api/admins/${adminId}/status`, statusData);
        },

        // 관리자 활동 로그 조회
        getActivityLog: (params) => {
          return api.get("/api/admins/activity-log", { params });
        },
      };

// 대시보드 API
export const dashboardAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockDashboardAPI
    : {
        // 메인 대시보드 데이터
        getMain: (params) => {
          return api.get("/api/dashboard/main", { params });
        },
        // 사용자 성장 트렌드
        getUserTrends: (params) => {
          return api.get("/api/dashboard/user-trends", { params });
        },
        // 콘텐츠 활동 트렌드
        getContentTrends: (params) => {
          return api.get("/api/dashboard/content-trends", { params });
        },
        // 통합 트렌드 데이터
        getTrends: (params) => {
          return api.get("/api/dashboard/trends", { params });
        },
        // 시스템 성능 모니터링
        getSystemPerformance: (params) => {
          return api.get("/api/dashboard/system-performance", { params });
        },
      };

// 설정 관리 API
export const settingsAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockSettingsAPI
    : {
        // 시스템 설정 조회
        getSystemSettings: () => {
          return api.get("/api/settings/system");
        },

        // 시스템 설정 업데이트
        updateSystemSettings: (settingsData) => {
          return api.put("/api/settings/system", settingsData);
        },

        // 금지어 목록 조회
        getBannedWords: () => {
          return api.get("/api/settings/banned-words");
        },

        // 금지어 목록 추가/삭제
        updateBannedWords: (words, action) => {
          return api.post("/api/settings/banned-words", { words, action });
        },

        // API 키 목록 조회
        getApiKeys: () => {
          return api.get("/api/settings/api-keys");
        },

        // API 키 생성
        createApiKey: (keyData) => {
          return api.post("/api/settings/api-keys", keyData);
        },

        // API 키 삭제
        deleteApiKey: (keyId) => {
          return api.delete(`/api/settings/api-keys/${keyId}`);
        },
      };

// 보고서 분석 API
export const reportsAnalyticsAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockReportsAnalyticsAPI
    : {
        // 12.1 사용자 분석 보고서
        getUserAnalytics: (params) =>
          api.get("/api/reports/user-analytics", { params }),
        // 12.2 콘텐츠 분석 보고서
        getContentAnalytics: (params) =>
          api.get("/api/reports/content-analytics", { params }),
        // 12.3 매칭 분석 보고서
        getMatchingAnalytics: (params) =>
          api.get("/api/reports/matching-analytics", { params }),
        // 12.4 모더레이션 활동 보고서
        getModerationAnalytics: (params) =>
          api.get("/api/reports/moderation-analytics", { params }),
        // 12.5 커스텀 보고서 생성
        createCustomReport: (data) => api.post("/api/reports/custom", data),
        // 12.6 정기 보고서 설정 (조회/생성)
        getScheduledReports: (params) =>
          api.get("/api/reports/scheduled", { params }),
        createScheduledReport: (data) =>
          api.post("/api/reports/scheduled", data),
        // 12.7 보고서 히스토리 조회
        getReportHistory: (params) =>
          api.get("/api/reports/history", { params }),
      };

// 관리자 문의 관리 API
export const inquiriesAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockInquiriesAPI
    : {
        // 문의 내역 목록 조회
        getInquiries: (params) => api.get("/api/admins/inquiries", { params }),
        // 문의 내역 상세 조회
        getInquiryDetail: (inquiryId) =>
          api.get(`/api/admins/inquiries/${inquiryId}`),
        // 문의 내역 상태 변경
        updateInquiryStatus: (inquiryId, statusData) =>
          api.patch(`/api/admins/inquiries/${inquiryId}/status`, statusData),
        // 문의 내역 답장 등록
        createInquiryReply: (inquiryId, data) =>
          api.post(`/api/admins/inquiries/${inquiryId}/reply`, data),
      };

// 스냅 관리 API
export const snapAPI =
  import.meta.env.VITE_USE_MOCK_API === "true"
    ? mockSnapAPI
    : {
        // 스냅 목록 조회
        getSnaps: (params) => {
          return api.get("/api/snaps", { params });
        },

        // 스냅 상세 조회
        getSnapDetail: (snapId) => {
          return api.get(`/api/snaps/${snapId}`);
        },

        // 스냅 상태 변경
        updateSnapStatus: (snapId, statusData) => {
          return api.patch(`/api/snaps/${snapId}/status`, statusData);
        },

        // 스냅 통계 대시보드 데이터
        getSnapStatistics: (params) => {
          return api.get("/api/snaps/statistics", { params });
        },
      };

export default api;
