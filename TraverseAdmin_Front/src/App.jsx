import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/common/Sidebar";

import MainPage from "./pages/MainPage";
import UserSignupPage from "./pages/UserPages/UserSignupPage";
import UsersPage from "./pages/UserPages/UsersPage";
import UserDetail from "./components/users/UserDetail";
import UserWithdrawalPage from "./pages/UserPages/UserWithdrawalPage";
import UserMatchingPage from "./pages/MatchingPages/UserMatchingPage";
import MatchingDetailPage from "./pages/MatchingPages/MatchingDetailPage";
import ReportPage from "./pages/ReportPages/ReportUsersPage";
import PostReportPage from "./pages/ReportPages/ReportPostsPage";
import ChatReportsPage from "./pages/ReportPages/ReportChatsPage";

import MyinfoPage from "./pages/MyinfoPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReportUsersDetail from "./components/reports/ReportUsersDetail";
import ReportPostsDetail from "./components/reports/ReportPostsDetail";
import ReportChatsDetail from "./components/reports/ReportChatsDetail";
import NotificationPage from "./pages/notifications/NotificationPage";
import HashtagListPage from "./pages/HashtagPages/HashtagListPage";
import HashtagDetailPage from "./pages/HashtagPages/HashtagDetailPage";
import HashtagStatisticsPage from "./pages/HashtagPages/HashtagStatisticsPage";
import HashtagWordcloudPage from "./pages/HashtagPages/HashtagWordcloudPage";
import ChatRoomListPage from "./pages/ChatPages/ChatRoomListPage";
import ChatRoomDetailPage from "./pages/ChatPages/ChatRoomDetailPage";
import PostsPage from "./pages/PostPages/PostsPage";
import PendingReviewPostsPage from "./pages/PostPages/PendingReviewPostsPage";
import PostsDetail from "./components/posts/PostsDetail";
import MatchHistoryPage from "./pages/MatchingPages/MatchHistoryPage";
import MatchingStatisticsPage from "./pages/MatchingPages/MatchingStatisticsPage";

// 관리자 관련 페이지 import
import AdminListPage from "./pages/AdminPages/AdminListPage";
import AdminDetailPage from "./pages/AdminPages/AdminDetailPage";
import ActivityLogPage from "./pages/AdminPages/ActivityLogPage";

import DashBoardUserTrendsPage from "./pages/DashboardPages/DashBoardUserTrendsPage";
import DashBoardContentTrendsPage from "./pages/DashboardPages/DashBoardContentTrendsPage";
import DashBoardSystemPerformancePage from "./pages/DashboardPages/DashBoardSystemPerformancePage";

import SettingsSystemGeneralPage from "./pages/SettingsysPage/SettingsSystemGeneralPage";
import SettingsSystemApiKeyPage from "./pages/SettingsysPage/SettingsSystemApiKeyPage";
import SettingBannedWordsPage from "./pages/SettingsysPage/SettingBannedWordsPage";

import UserAnalyticsReportPage from "./pages/ReportingPage/UserAnalyticsReportPage";
import ContentAnalyticsReportPage from "./pages/ReportingPage/ContentAnalyticsReportPage";
import MatchingAnalyticsReportPage from "./pages/ReportingPage/MatchingAnalyticsReportPage";
import ModerationAnalyticsReportPage from "./pages/ReportingPage/ModerationAnalyticsReportPage";
import CustomReportPage from "./pages/ReportingPage/CustomReportPage";
import ScheduledReportPage from "./pages/ReportingPage/ScheduledReportPage";
import ReportHistoryPage from "./pages/ReportingPage/ReportHistoryPage";

import InquiriesListPage from "./pages/InquiriesPages/InquiriesListPage";
import InquiriesDetailPage from "./pages/InquiriesPages/InquiriesDetailPage";

import SnapListPage from "./pages/SnapPages/SnapListPage";
import SnapDetailPage from "./pages/SnapPages/SnapDetailPage";
import NotificationHistoryPage from "./pages/notifications/NotificationHistoryPage";

import ReportSnapsPage from "./pages/ReportPages/ReportSnapsPage";
import ReportSnapsDetail from "./components/reports/ReportSnapsDetail";

import ReportCommentsPage from "./pages/ReportPages/ReportCommentsPage";
import ReportCommentsDetail from "./components/reports/ReportCommentsDetail";

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 초기 로딩 시 인증 상태 확인
        const checkAuth = () => {
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const shouldHideSidebar =
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="flex overflow-y-auto h-screen text-gray-100 bg-gray-900">
            {/* BG */}
            <div className="fixed inset-0 z-[-1]">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>

            {/* Sidebar가 필요 없는 경우에만 Sidebar 렌더링 */}
            {!shouldHideSidebar && <Sidebar />}

            <div
                className={`flex-1 relative z-20 ${
                    shouldHideSidebar ? "flex justify-center items-center" : ""}`}
            >
                {/* 로그인/회원가입 페이지에서만 중앙 정렬 */}
                <Routes>
                    {/* 공개 라우트 */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/* 보호된 라우트 */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/signup"
                        element={
                            <ProtectedRoute>
                                <UserSignupPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/:userId"
                        element={
                            <ProtectedRoute>
                                <UserDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/withdrawal"
                        element={
                            <ProtectedRoute>
                                <UserWithdrawalPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matching/settings"
                        element={
                            <ProtectedRoute>
                                <UserMatchingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matching/:matchId"
                        element={
                            <ProtectedRoute>
                                <MatchingDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matching/history"
                        element={
                            <ProtectedRoute>
                                <MatchHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matching/statistics"
                        element={
                            <ProtectedRoute>
                                <MatchingStatisticsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/user"
                        element={
                            <ProtectedRoute>
                                <ReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/user/:reportId"
                        element={
                            <ProtectedRoute>
                                <ReportUsersDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/post"
                        element={
                            <ProtectedRoute>
                                <PostReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/post/:reportId"
                        element={
                            <ProtectedRoute>
                                <ReportPostsDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/chat"
                        element={
                            <ProtectedRoute>
                                <ChatReportsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/chat/:reportId"
                        element={
                            <ProtectedRoute>
                                <ReportChatsDetail />
                            </ProtectedRoute>
                        }
                    />
                    {/* 해시태그 관련 라우트 추가 */}
                    <Route
                        path="/hashtags"
                        element={
                            <ProtectedRoute>
                                <HashtagListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/hashtags/stats"
                        element={
                            <ProtectedRoute>
                                <HashtagStatisticsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/hashtags/wordcloud"
                        element={
                            <ProtectedRoute>
                                <HashtagWordcloudPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/hashtags/:hashtagId"
                        element={
                            <ProtectedRoute>
                                <HashtagDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chats/rooms"
                        element={
                            <ProtectedRoute>
                                <ChatRoomListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chats/rooms/:roomId"
                        element={
                            <ProtectedRoute>
                                <ChatRoomDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* 기존 라우트들 */}

                    <Route
                        path="/myinfo"
                        element={
                            <ProtectedRoute>
                                <MyinfoPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <NotificationPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications/history"
                        element={
                            <ProtectedRoute>
                                <NotificationHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts"
                        element={
                            <ProtectedRoute>
                                <PostsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/:postId"
                        element={
                            <ProtectedRoute>
                                <PostsDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/pending-reviews"
                        element={
                            <ProtectedRoute>
                                <PendingReviewPostsPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* 관리자 관련 라우트 추가 */}
                    <Route
                        path="/admin/admins"
                        element={
                            <ProtectedRoute>
                                <AdminListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/admins/:adminId"
                        element={
                            <ProtectedRoute>
                                <AdminDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/activity-logs"
                        element={
                            <ProtectedRoute>
                                <ActivityLogPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/user-trends"
                        element={
                            <ProtectedRoute>
                                <DashBoardUserTrendsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/content-trends"
                        element={
                            <ProtectedRoute>
                                <DashBoardContentTrendsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/system-performance"
                        element={
                            <ProtectedRoute>
                                <DashBoardSystemPerformancePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/system/general"
                        element={
                            <ProtectedRoute>
                                <SettingsSystemGeneralPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/system/apikey"
                        element={
                            <ProtectedRoute>
                                <SettingsSystemApiKeyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/system/banned-words"
                        element={
                            <ProtectedRoute>
                                <SettingBannedWordsPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* 통계/보고서 관련 라우트 */}
                    <Route
                        path="/reporting/user-analytics"
                        element={
                            <ProtectedRoute>
                                <UserAnalyticsReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/content-analytics"
                        element={
                            <ProtectedRoute>
                                <ContentAnalyticsReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/matching-analytics"
                        element={
                            <ProtectedRoute>
                                <MatchingAnalyticsReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/moderation-analytics"
                        element={
                            <ProtectedRoute>
                                <ModerationAnalyticsReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/custom"
                        element={
                            <ProtectedRoute>
                                <CustomReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/scheduled"
                        element={
                            <ProtectedRoute>
                                <ScheduledReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reporting/history"
                        element={
                            <ProtectedRoute>
                                <ReportHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inquiry/list"
                        element={
                            <ProtectedRoute>
                                <InquiriesListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inquiry/:inquiryId"
                        element={
                            <ProtectedRoute>
                                <InquiriesDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* Snap 관리 라우트 */}
                    <Route
                        path="/snaps"
                        element={
                            <ProtectedRoute>
                                <SnapListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/snaps/:snapId"
                        element={
                            <ProtectedRoute>
                                <SnapDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/snap"
                        element={
                            <ProtectedRoute>
                                <ReportSnapsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/snap/:reportId"
                        element={
                            <ProtectedRoute>
                                <ReportSnapsDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/comment"
                        element={
                            <ProtectedRoute>
                                <ReportCommentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/comment/:reportId"
                        element={
                            <ProtectedRoute>
                                <ReportCommentsDetail />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
