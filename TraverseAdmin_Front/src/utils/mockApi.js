// 해시태그 목업 데이터
const mockHashtags = [
  {
    id: "1",
    name: "Travel",
    usage_count: 1,
    created_at: "2023-01-15T08:30:00Z",
    last_used_at: "2023-03-25T14:22:35Z",
    trend: "hot",
    status: "active",
  },
  {
    id: "2",
    name: "Food",
    usage_count: 5,
    created_at: "2023-02-10T12:45:00Z",
    last_used_at: "2023-03-24T19:15:42Z",
    trend: "hot",
    status: "active",
  },
  {
    id: "3",
    name: "Fashion",
    usage_count: 1,
    created_at: "2023-01-25T10:15:00Z",
    last_used_at: "2023-03-23T08:56:21Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "4",
    name: "Photography",
    usage_count: 4,
    created_at: "2023-02-05T15:30:00Z",
    last_used_at: "2023-03-25T11:34:09Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "5",
    name: "Music",
    usage_count: 7,
    created_at: "2023-01-20T09:45:00Z",
    last_used_at: "2023-03-24T16:42:57Z",
    trend: "new",
    status: "active",
  },
  {
    id: "6",
    name: "Gaming",
    usage_count: 2,
    created_at: "2023-03-01T14:20:00Z",
    last_used_at: "2023-03-25T20:18:32Z",
    trend: "new",
    status: "active",
  },
  {
    id: "7",
    name: "Sports",
    usage_count: 5,
    created_at: "2023-02-15T11:10:00Z",
    last_used_at: "2023-03-23T13:27:45Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "8",
    name: "Beauty",
    usage_count: 9,
    created_at: "2023-01-30T16:50:00Z",
    last_used_at: "2023-03-24T09:11:19Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "9",
    name: "Technology",
    usage_count: 10,
    created_at: "2023-02-20T13:25:00Z",
    last_used_at: "2023-03-25T17:39:28Z",
    trend: "hot",
    status: "active",
  },
  {
    id: "10",
    name: "Art",
    usage_count: 3,
    created_at: "2023-03-05T10:40:00Z",
    last_used_at: "2023-03-24T12:03:51Z",
    trend: "new",
    status: "active",
  },
  {
    id: "11",
    name: "Fitness",
    usage_count: 10,
    created_at: "2023-02-25T08:15:00Z",
    last_used_at: "2023-03-23T18:51:07Z",
    trend: "stable",
    status: "featured",
  },
  {
    id: "12",
    name: "Health",
    usage_count: 7,
    created_at: "2023-01-10T17:30:00Z",
    last_used_at: "2023-03-25T07:22:43Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "13",
    name: "Books",
    usage_count: 2,
    created_at: "2023-03-10T11:55:00Z",
    last_used_at: "2023-03-24T21:46:37Z",
    trend: "new",
    status: "active",
  },
  {
    id: "14",
    name: "Career",
    usage_count: 4,
    created_at: "2023-02-01T09:20:00Z",
    last_used_at: "2023-03-23T15:13:14Z",
    trend: "stable",
    status: "active",
  },
  {
    id: "15",
    name: "Hate",
    usage_count: 4,
    created_at: "2023-01-05T14:35:00Z",
    last_used_at: "2023-03-25T02:59:26Z",
    trend: "stable",
    status: "blocked",
  },
];
// 테스트용 사용자 데이터 생성
const mockUsers = Array.from({ length: 100 }, (_, index) => {
  const currentYear = new Date().getFullYear();
  const minAge = 10;
  const maxAge = 80;
  const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthYear = currentYear - randomAge;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1;

  return {
    user_id: `USER${(index + 1).toString().padStart(5, "0")}`,
    user_name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    verify: index % 2 === 0 ? ["email", "phone"] : ["email"],
    role: index % 3 === 0 ? "Admin" : "User",
    status: index % 4 === 0 ? "Suspended" : "Active",
    created_at: new Date(
      Date.now() - Math.random() * 10000000000
    ).toISOString(),
    last_login_at: new Date(
      Date.now() - Math.random() * 1000000000
    ).toISOString(),
    report_count: Math.floor(Math.random() * 10),
    country_code: ["KR", "US", "JP", "CN"][Math.floor(Math.random() * 4)],
    birthdate: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
      birthDay
    ).padStart(2, "0")}T00:00:00.000Z`,
  };
});

// Mock Posts 데이터
const mockPosts = Array.from({ length: 100 }, (_, index) => {
  const status = ["active", "pending", "deleted"][
    Math.floor(Math.random() * 3)
  ];
  const createdAt = new Date(Date.now() - Math.random() * 10000000000);
  const reportCount = Math.floor(Math.random() * 5);
  // 게시물 본문 및 이미지 mock 추가
  const post_content = `이것은 테스트 게시물 ${index + 1}의 본문입니다.`;
  const imageCount = Math.floor(Math.random() * 3) + 1; // 1~3장
  const post_images = Array.from(
    { length: imageCount },
    (_, i) => `https://picsum.photos/800/600?random=${index + 1}_${i + 1}`
  );
  return {
    post_id: `POST${(index + 1).toString().padStart(5, "0")}`,
    user_id: `USER${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(5, "0")}`,
    status: status,
    created_at: createdAt.toISOString(),
    report_count: reportCount,
    like_count: Math.floor(Math.random() * 1000),
    view_count: Math.floor(Math.random() * 5000),
    hash_tags: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => mockHashtags[Math.floor(Math.random() * mockHashtags.length)].name
    ),
    post_content,
    post_images,
  };
});
const postIds = mockPosts.map((p) => p.post_id);
// Mock user reports data (이전 mockReports)
const mockUserReports = Array.from({ length: 100 }, (_, index) => ({
  report_id: `UR${(index + 1).toString().padStart(5, "0")}`,
  type: "user",
  reported_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reported_user_name: `Reported User ${index + 1}`,
  reporter_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reason: ["스팸", "불법컨텐츠", "욕설/비방", "사기", "기타"][
    Math.floor(Math.random() * 5)
  ],
  description: `신고 상세 내용 ${index + 1}`,
  status: ["pending", "resolved", "rejected"][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  severity: Math.floor(Math.random() * 5) + 1,
}));

// Mock post reports data
const mockPostReports = Array.from({ length: 100 }, (_, index) => ({
  report_id: `PR${(index + 1).toString().padStart(5, "0")}`,
  type: "post",
  post_id: postIds[Math.floor(Math.random() * postIds.length)],
  post_title: `게시물 제목 ${index + 1}`,
  reporter_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reason: ["스팸", "불법컨텐츠", "욕설/비방", "사기", "기타"][
    Math.floor(Math.random() * 5)
  ],
  description: `게시물 신고 상세 내용 ${index + 1}`,
  status: ["pending", "resolved", "rejected"][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  severity: Math.floor(Math.random() * 5) + 1,
}));

// Mock chat reports data
const mockChatReports = Array.from({ length: 100 }, (_, index) => ({
  report_id: `CR${(index + 1).toString().padStart(5, "0")}`,
  type: "chat",
  chat_id: `CHAT${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  chat_room_id: `ROOM${Math.floor(Math.random() * 100)
    .toString()
    .padStart(3, "0")}`,
  reporter_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reported_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reason: ["욕설/비방", "스팸", "성희롱", "불법홍보", "기타"][
    Math.floor(Math.random() * 5)
  ],
  description: `채팅 신고 상세 내용 ${index + 1}`,
  status: ["pending", "resolved", "rejected"][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  severity: Math.floor(Math.random() * 5) + 1,
}));

// Mock notification templates data
const mockNotificationTemplates = [
  {
    id: "1",
    name: "회원가입 환영",
    type: "congratulation",
    content: "환영합니다! {name}님, 회원가입을 축하드립니다.",
    created_at: "2024-03-23T00:00:00Z",
    updated_at: "2024-03-23T00:00:00Z",
    usage_count: 150,
  },
  {
    id: "2",
    name: "계정 정지 알림",
    type: "warning",
    content: "안녕하세요 {name}님, 계정이 {duration}일간 정지되었습니다.",
    created_at: "2024-03-23T00:00:00Z",
    updated_at: "2024-03-23T00:00:00Z",
    usage_count: 30,
  },
  {
    id: "3",
    name: "문의 답변 알림",
    type: "answer",
    content: "안녕하세요 {name}님, 문의하신 내용에 대한 답변이 등록되었습니다.",
    created_at: "2024-03-23T00:00:00Z",
    updated_at: "2024-03-23T00:00:00Z",
    usage_count: 45,
  },
  {
    id: "4",
    name: "신고 처리 알림",
    type: "warning",
    content: "안녕하세요 {name}님, 신고하신 내용이 처리되었습니다.",
    created_at: "2024-03-23T00:00:00Z",
    updated_at: "2024-03-23T00:00:00Z",
    usage_count: 20,
  },
];

// Mock notification history data
const mockNotificationHistory = [];

// 웹훅 관련 상태 저장
let mockWebhook = {
  url: "",
  status: "inactive", // inactive, active, error
  created_at: null,
  updated_at: null,
};

// Mock 인증 데이터
let mockInviteCode = {
  code: "",
  expires_at: null,
  email: "",
  role: "",
};

// Mock 채팅방 데이터
const mockChatRooms = Array.from({ length: 100 }, (_, index) => {
  // 참가자 수를 랜덤으로 결정 (2명 또는 2~10명)
  const isDirectChat = Math.random() > 0.5;
  const participantCount = isDirectChat ? 2 : Math.floor(Math.random() * 8) + 3; // 3~10명

  const participants = Array.from({ length: participantCount }, () => {
    const joinedDate = new Date(Date.now() - Math.random() * 10000000000);
    const lastActiveDate = new Date(Date.now() - Math.random() * 5000000000);

    return {
      user_id: `USER${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(5, "0")}`,
      username: `User ${Math.floor(Math.random() * 1000)}`,
      profile_image:
        Math.random() > 0.5
          ? `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
          : null,
      joined_at: joinedDate.toISOString(),
      last_active_at: lastActiveDate.toISOString(),
    };
  });

  return {
    room_id: `ROOM${(index + 1).toString().padStart(5, "0")}`,
    name: `채팅방 ${index + 1}`,
    type: participants.length === 2 ? "direct" : "group",
    participants: participants,
    created_at: new Date(
      Date.now() - Math.random() * 10000000000
    ).toISOString(),
    last_message_at: new Date(
      Date.now() - Math.random() * 1000000000
    ).toISOString(),
    message_count: Math.floor(Math.random() * 1000),
    report_count: Math.floor(Math.random() * 10),
    status: ["active", "archived", "blocked"][Math.floor(Math.random() * 3)],
  };
});

// 매치 목업 데이터
const mockMatches = Array.from({ length: 100 }, (_, index) => {
  const createdAt = new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  );
  const user1Id = `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`;
  const user2Id = `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`;
  const score = (60 + Math.random() * 40).toFixed(1); // 60.0 ~ 100.0 사이의 매칭 점수
  const messageCount = Math.floor(Math.random() * 100);
  const status =
    messageCount > 10 ? "successful" : messageCount > 0 ? "active" : "failed";
  const chatRoomId =
    status !== "failed"
      ? `ROOM${Math.floor(Math.random() * 100)
          .toString()
          .padStart(3, "0")}`
      : null;

  return {
    match_id: `MATCH${(index + 1).toString().padStart(5, "0")}`,
    user1_id: user1Id,
    user1_name: `User ${user1Id.substring(4)}`,
    user2_id: user2Id,
    user2_name: `User ${user2Id.substring(4)}`,
    created_at: createdAt.toISOString(),
    score: parseFloat(score),
    status: status,
    chat_room_id: chatRoomId,
    message_count: messageCount,
  };
});

// 매칭 설정 목업 데이터
let mockMatchingSettings = {
  weight_settings: {
    location: 30,
    interests: 25,
    age: 20,
    gender: 15,
    activity_level: 10,
  },
  thresholds: {
    minimum_score: 60,
    maximum_distance: 50, // km
  },
  cooldown_period: 24, // 시간
  matches_per_day: 3,
  last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_by: "ADMIN001",
};

// 관리자 Mock 데이터
const mockAdmins = Array.from({ length: 30 }, (_, index) => {
  const roles = [
    "chief_manager",
    "post_manager",
    "chat_manager",
    "user_manager",
    "data_manager",
  ];
  const statuses = ["active", "suspended", "deleted"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const status =
    index < 25
      ? "active"
      : statuses[Math.floor(Math.random() * statuses.length)];

  const createdAt = new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  );

  return {
    admin_id: `ADMIN${(index + 1).toString().padStart(4, "0")}`,
    name: `관리자 ${index + 1}`,
    email: `admin${index + 1}@example.com`,
    role: role,
    status: status,
    last_login_at: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    created_at: createdAt.toISOString(),
    updated_at: new Date(
      createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
});

// 관리자 활동 로그 Mock 데이터
const mockActivityLogs = Array.from({ length: 200 }, (_, index) => {
  const actions = [
    "로그인",
    "관리자 추가",
    "사용자 상태 변경",
    "게시물 삭제",
    "신고 처리",
    "채팅방 차단",
    "시스템 설정 변경",
    "알림 발송",
    "매칭 설정 변경",
    "해시태그 상태 변경",
  ];

  const adminIndex = Math.floor(Math.random() * mockAdmins.length);
  const adminId = mockAdmins[adminIndex].admin_id;
  const adminName = mockAdmins[adminIndex].name;
  const action = actions[Math.floor(Math.random() * actions.length)];

  return {
    log_id: `LOG${(index + 1).toString().padStart(6, "0")}`,
    admin_id: adminId,
    admin_name: adminName,
    action: action,
    timestamp: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    target_id:
      Math.random() > 0.5 ? `TARGET${Math.floor(Math.random() * 1000)}` : null,
    target_type:
      Math.random() > 0.5
        ? ["user", "post", "chat", "system"][Math.floor(Math.random() * 4)]
        : null,
    previous_state: Math.random() > 0.7 ? "active" : "inactive",
    new_state: Math.random() > 0.7 ? "inactive" : "active",
    additional_data: JSON.stringify({
      description: `${action} 작업을 수행했습니다.`,
      affected_users: Math.floor(Math.random() * 10),
      success: true,
      transaction_id: `TXN${Math.floor(Math.random() * 1000000)}`,
      metadata: {
        browser: ["Chrome", "Firefox", "Safari"][Math.floor(Math.random() * 3)],
        platform: ["Windows", "MacOS", "Linux"][Math.floor(Math.random() * 3)],
      },
    }),
    ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}`,
  };
});

export const mockUserAPI = {
  getUsers: async ({ page, limit, search, status, sort_by, sort_order }) => {
    // 검색 및 필터링 로직
    let filteredUsers = [...mockUsers];

    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.user_name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.status.toLowerCase() === status.toLowerCase()
      );
    }

    // 정렬 로직
    filteredUsers.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      return order * (new Date(a[sort_by]) - new Date(b[sort_by]));
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // API 응답 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        users: paginatedUsers,
        total_count: filteredUsers.length,
        total_pages: Math.ceil(filteredUsers.length / limit),
        current_page: page,
      },
    };
  },

  //------------------유저 상세 정보 조회 api 추가------------------
  getUserDetail: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.user_id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        phone_number: "+82-10-1234-5678",
        profile_picture: "",
        created_at: user.created_at,
        last_login_at: user.last_login_at,
        birthdate: user.birthdate,
        post_count: Math.floor(Math.random() * 100),
        report_count: user.report_count,
        country_code: user.country_code,
        gender: ["Male", "Female", "Other"][Math.floor(Math.random() * 3)],
        interest_keywords: ["Travel", "Music", "Sports", "Technology"],
        location: "Seoul, South Korea",
        native_language: "Korean",
        preferred_language: "English",
        info: {
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          followers: Array.from(
            { length: Math.floor(Math.random() * 100) },
            (_, i) => `follower${i}`
          ),
          following: Array.from(
            { length: Math.floor(Math.random() * 100) },
            (_, i) => `following${i}`
          ),
          posts: Array.from(
            { length: Math.floor(Math.random() * 10) },
            (_, i) => ({
              id: i,
              content: `Sample post ${i}`,
              created_at: new Date().toISOString(),
            })
          ),
        },
      },
    };
  },

  getUserStatistics: async ({ start_date, end_date, interval }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const activeUsers = mockUsers.filter(
      (user) => user.status === "Active"
    ).length;
    const newUsers = mockUsers.filter(
      (user) => new Date(user.created_at) >= new Date(start_date)
    ).length;

    // Generate trend data based on interval
    const trend = [];
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    let currentDate = new Date(startDate);

    const getIntervalEndDate = (date, interval) => {
      const newDate = new Date(date);
      switch (interval) {
        case "weekly":
          newDate.setDate(date.getDate() + 7);
          break;
        case "monthly":
          newDate.setMonth(date.getMonth() + 1);
          break;
        default: // daily
          newDate.setDate(date.getDate() + 1);
      }
      return newDate;
    };

    while (currentDate <= endDate) {
      const intervalEndDate = getIntervalEndDate(currentDate, interval);

      // 해당 기간의 새로운 사용자 수 계산
      const periodNewUsers = mockUsers.filter((user) => {
        const userDate = new Date(user.created_at);
        return userDate >= currentDate && userDate < intervalEndDate;
      }).length;

      // 해당 기간의 활성 사용자 수 계산
      const periodActiveUsers = Math.floor(
        activeUsers * (0.8 + Math.random() * 0.4)
      );

      const periodReports = mockUserReports.filter((report) => {
        const reportDate = new Date(report.created_at);
        return reportDate >= currentDate && reportDate < intervalEndDate;
      }).length;

      trend.push({
        date: currentDate.toISOString().split("T")[0],
        count: mockUsers.length,
        new_users: periodNewUsers,
        active_users: periodActiveUsers,
        new_reports: periodReports, // ← 이 줄 추가!
      });

      currentDate = intervalEndDate;
    }

    // 신고 통계 데이터
    const reportStats = {
      total: mockUserReports.length,
      pending: mockUserReports.filter((r) => r.status === "pending").length,
      resolved: mockUserReports.filter((r) => r.status === "resolved").length,
      by_category: [
        { category: "스팸", count: Math.floor(Math.random() * 50) },
        { category: "불법컨텐츠", count: Math.floor(Math.random() * 50) },
        { category: "욕설/비방", count: Math.floor(Math.random() * 30) },
        { category: "사기", count: Math.floor(Math.random() * 20) },
        { category: "기타", count: Math.floor(Math.random() * 20) },
      ],
    };

    return {
      success: true,
      data: {
        total_users: mockUsers.length,
        new_users: newUsers,
        active_users: activeUsers,
        user_trend: trend,
        report_stats: reportStats,
      },
    };
  },

  getWithdrawalReasons: async ({
    start_date,
    end_date,
    interval = "daily",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 날짜 범위에 따른 mock 데이터 생성
    const mockReasons = [
      { reason: "서비스 이용 불편", count: 150, percentage: 35.7 },
      { reason: "개인정보 보호 우려", count: 89, percentage: 21.2 },
      { reason: "다른 서비스로 이전", count: 76, percentage: 18.1 },
      { reason: "서비스 품질 불만족", count: 67, percentage: 16.0 },
      { reason: "기타", count: 38, percentage: 9.0 },
    ];

    // DashboardTrendsChart와 동일한 방식으로 trend 생성
    const trend = [];
    const start = new Date(start_date);
    const end = new Date(end_date);
    let current = new Date(start);
    while (current <= end) {
      trend.push({
        date: current.toISOString().split("T")[0],
        count:
          interval === "monthly"
            ? Math.floor(Math.random() * 300) + 50
            : interval === "weekly"
            ? Math.floor(Math.random() * 100) + 10
            : Math.floor(Math.random() * 20) + 1,
      });
      if (interval === "monthly") {
        current.setMonth(current.getMonth() + 1);
      } else if (interval === "weekly") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    return {
      success: true,
      data: {
        total: mockReasons.reduce((sum, item) => sum + item.count, 0),
        by_reason: mockReasons,
        trend: trend,
      },
    };
  },

  // 사용자 상태 변경 API 추가
  updateUserStatus: async (userId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.user_id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 실제로는 여기서 사용자 상태를 업데이트합니다
    user.status = statusData.status;

    return {
      success: true,
      message: "사용자 상태가 변경되었습니다",
    };
  },
};

export const mockReportsAPI = {
  getReportsUsers: async ({
    page = 1,
    limit = 20,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredReports = [...mockUserReports];

    // 검색어 필터링
    if (search) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.reported_user_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          report.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 상태 필터링
    if (status !== "all") {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }

    // 정렬
    filteredReports.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at" || sort_by === "severity") {
        if (sort_by === "created_at") {
          return order * (new Date(a.created_at) - new Date(b.created_at));
        }
        return order * (a[sort_by] - b[sort_by]);
      }
      return 0;
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        reports: paginatedReports.map((report) => ({
          report_id: report.report_id,
          reported_user_id: report.reported_user_id,
          reported_user_name: report.reported_user_name,
          reporter_user_id: report.reporter_user_id,
          reason: report.reason,
          description: report.description,
          status: report.status,
          created_at: report.created_at,
          severity: report.severity,
        })),
        total_count: filteredReports.length,
        current_page: page,
        total_pages: Math.ceil(filteredReports.length / limit),
      },
    };
  },

  getReportDetail: async (reportId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allReports = [
      ...mockPostReports,
      ...mockUserReports,
      ...mockChatReports,
      ...mockSnapReports,
      ...mockCommentReports,
    ];
    const report = allReports.find((r) => r.report_id === reportId);
    if (!report) {
      throw new Error("Report not found");
    }
    return {
      success: true,
      data: {
        data: {
          ...report,
          target_id:
            report.reported_user_id ||
            report.post_id ||
            report.chat_id ||
            report.snap_id ||
            report.comment_id,
          target_details: {
            username: report.reported_user_id
              ? `User ${report.reported_user_id}`
              : undefined,
            email: report.reported_user_id
              ? `${report.reported_user_id.toLowerCase()}@example.com`
              : undefined,
            chat_room_id: report.chat_room_id,
            chat_id: report.chat_id,
            post_title: report.post_title,
            snap_title: report.snap_title,
            comment_content: report.comment_content,
          },
          reporter_details: {
            username: `User ${report.reporter_user_id}`,
            email: `${report.reporter_user_id.toLowerCase()}@example.com`,
          },
          evidence: [
            "https://picsum.photos/200/300",
            "https://picsum.photos/200/300",
          ],
          updated_at: new Date().toISOString(),
          processed_by: report.processed_by || "ADMIN001",
          processed_at: report.processed_at || null,
          comment: report.comment || "",
          action_taken: report.action_taken || "",
        },
      },
    };
  },

  getReportsPosts: async ({
    page = 1,
    limit = 20,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredReports = [...mockPostReports];

    // 검색어 필터링
    if (search) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.post_title.toLowerCase().includes(search.toLowerCase()) ||
          report.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 상태 필터링
    if (status !== "all") {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }

    // 정렬
    filteredReports.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at" || sort_by === "severity") {
        if (sort_by === "created_at") {
          return order * (new Date(a.created_at) - new Date(b.created_at));
        }
        return order * (a[sort_by] - b[sort_by]);
      }
      return 0;
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        reports: paginatedReports,
        total_count: filteredReports.length,
        current_page: page,
        total_pages: Math.ceil(filteredReports.length / limit),
      },
    };
  },

  getReportsChats: async ({
    page = 1,
    limit = 20,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredReports = [...mockChatReports];

    // 검색어 필터링
    if (search) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.chat_id.toLowerCase().includes(search.toLowerCase()) ||
          report.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 상태 필터링
    if (status !== "all") {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }

    // 정렬
    filteredReports.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at" || sort_by === "severity") {
        if (sort_by === "created_at") {
          return order * (new Date(a.created_at) - new Date(b.created_at));
        }
        return order * (a[sort_by] - b[sort_by]);
      }
      return 0;
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        reports: paginatedReports,
        total_count: filteredReports.length,
        current_page: page,
        total_pages: Math.ceil(filteredReports.length / limit),
      },
    };
  },

  getReportsSnaps: async ({
    page = 1,
    limit = 20,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filteredReports = [...mockSnapReports];
    if (search) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.snap_title.toLowerCase().includes(search.toLowerCase()) ||
          report.reason.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== "all") {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }
    filteredReports.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at" || sort_by === "severity") {
        if (sort_by === "created_at") {
          return order * (new Date(a.created_at) - new Date(b.created_at));
        }
        return order * (a[sort_by] - b[sort_by]);
      }
      return 0;
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    return {
      success: true,
      data: {
        reports: paginatedReports,
        total_count: filteredReports.length,
        current_page: page,
        total_pages: Math.ceil(filteredReports.length / limit),
      },
    };
  },

  getReportsComments: async ({
    page = 1,
    limit = 20,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filteredReports = [...mockCommentReports];
    if (search) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.comment_content.toLowerCase().includes(search.toLowerCase()) ||
          report.reason.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== "all") {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }
    filteredReports.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at" || sort_by === "severity") {
        if (sort_by === "created_at") {
          return order * (new Date(a.created_at) - new Date(b.created_at));
        }
        return order * (a[sort_by] - b[sort_by]);
      }
      return 0;
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    return {
      success: true,
      data: {
        reports: paginatedReports,
        total_count: filteredReports.length,
        current_page: page,
        total_pages: Math.ceil(filteredReports.length / limit),
      },
    };
  },

  processReport: async (reportId, processData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allReports = [
      ...mockUserReports,
      ...mockPostReports,
      ...mockChatReports,
      ...mockSnapReports,
      ...mockCommentReports,
    ];
    const report = allReports.find((r) => r.report_id === reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    // action_taken 값을 한글로 변환
    const actionTakenMap = {
      none: "징계 없음",
      warn: "경고",
      suspend: "정지",
      delete_content: "콘텐츠 삭제",
      ban: "영구 정지",
      unsuspend: "정지 해제",
    };

    // 신고 상태 업데이트
    report.status = processData.status;
    report.processed_at = new Date().toISOString();
    report.processed_by = "ADMIN001";
    report.comment = processData.comment;
    report.action_taken =
      actionTakenMap[processData.action_taken] || processData.action_taken;

    // 정지 처리 시 정지 일수/시작일 저장
    if (
      processData.action_taken === "suspend" ||
      processData.action_taken === "정지"
    ) {
      report.suspend_duration = processData.suspension_duration || 7;
      report.suspend_start = report.processed_at;
    } else if (
      processData.action_taken === "unsuspend" ||
      processData.action_taken === "정지 해제"
    ) {
      report.suspend_duration = null;
      report.suspend_start = null;
    }

    return {
      success: true,
      message: "신고가 처리되었습니다",
      data: report,
    };
  },
};

export const mockNotificationAPI = {
  // 알림 템플릿 목록 조회
  getNotificationTemplates: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        templates: mockNotificationTemplates,
      },
    };
  },

  // 알림 템플릿 생성/수정
  saveNotificationTemplate: async (templateData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (templateData.id) {
      // 수정
      const index = mockNotificationTemplates.findIndex(
        (t) => t.id === templateData.id
      );
      if (index !== -1) {
        mockNotificationTemplates[index] = {
          ...mockNotificationTemplates[index],
          ...templateData,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // 생성
      const newTemplate = {
        ...templateData,
        id: (mockNotificationTemplates.length + 1).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0,
      };
      mockNotificationTemplates.push(newTemplate);
    }

    return {
      success: true,
      data: {
        message: "템플릿이 저장되었습니다.",
      },
    };
  },

  // 알림 발송
  sendNotification: async (notificationData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newNotification = {
      id: `noti_${(mockNotificationHistory.length + 1)
        .toString()
        .padStart(5, "0")}`,
      template_id: notificationData.template_id,
      template_name: mockNotificationTemplates.find(
        (t) => t.id === notificationData.template_id
      )?.name,
      type: mockNotificationTemplates.find(
        (t) => t.id === notificationData.template_id
      )?.type,
      sent_at: new Date().toISOString(),
      recipient_count: notificationData.recipients.length,
      read_count: 0,
      sender: {
        id: "admin_1",
        name: "관리자 1",
      },
    };

    mockNotificationHistory.push(newNotification);

    return {
      success: true,
      data: {
        notification_id: newNotification.id,
        sent_count: notificationData.recipients.length,
      },
      message: "알림이 발송되었습니다.",
    };
  },

  // 알림 발송 내역 조회
  getNotificationHistory: async ({ page, limit, search, type }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredHistory = [...mockNotificationHistory];

    // 검색어 필터링
    if (search) {
      filteredHistory = filteredHistory.filter(
        (notification) =>
          notification.template_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          notification.sender.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 유형 필터링
    if (type) {
      filteredHistory = filteredHistory.filter(
        (notification) => notification.type === type
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        notifications: paginatedHistory,
        total: filteredHistory.length,
      },
    };
  },

  // 알림 템플릿 삭제
  deleteNotificationTemplate: async (templateId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const idx = mockNotificationTemplates.findIndex((t) => t.id === templateId);
    if (idx !== -1) {
      mockNotificationTemplates.splice(idx, 1);
      return { success: true, message: "템플릿이 삭제되었습니다." };
    } else {
      return { success: false, message: "템플릿을 찾을 수 없습니다." };
    }
  },
};

export const mockAuthAPI = {
  // 초대 코드 생성
  generateInviteCode: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("mockAuthAPI - 요청 데이터:", data);

    // 요청에서 필수 데이터 확인
    if (!data.email || !data.role || !data.time_stamp) {
      return {
        success: false,
        message: "필수 데이터가 누락되었습니다 (email, role, time_stamp)",
      };
    }

    // 랜덤 코드 생성 (16자리)
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // 24시간 후 만료
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 데이터 저장
    mockInviteCode = {
      code: result,
      expires_at: expiresAt.toISOString(),
      email: data.email,
      role: data.role,
    };

    // 응답 생성
    const response = {
      success: true,
      data: {
        code: result,
        expires_at: expiresAt.toISOString(),
      },
      message: "초대 코드가 생성되었습니다. 24시간 내에 사용해주세요.",
    };

    console.log("mockAuthAPI - 응답 구조:", response);
    return response;
  },

  // 초대 코드 검증
  validateInviteCode: async ({ code }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("mockAuthAPI - 초대 코드 검증 요청:", { code });

    // 코드 파라미터 확인
    if (!code) {
      return {
        success: false,
        message: "초대 코드를 입력해주세요.",
      };
    }

    // 코드가 유효한지 확인
    const isValid = mockInviteCode.code === code;

    // 만료 시간 확인
    const now = new Date();
    const expiresAt = mockInviteCode.expires_at
      ? new Date(mockInviteCode.expires_at)
      : null;
    const isExpired = expiresAt ? now > expiresAt : true;

    if (!isValid) {
      return {
        success: false,
        message: "유효하지 않은 초대 코드입니다.",
      };
    }

    if (isExpired) {
      return {
        success: false,
        message: "초대 코드가 만료되었습니다.",
      };
    }

    // 응답 생성
    const response = {
      success: true,
      data: {
        is_valid: true,
        role: mockInviteCode.role,
        email: mockInviteCode.email,
      },
      message: `${mockInviteCode.role} 권한으로 인증되었습니다.`,
    };

    console.log("mockAuthAPI - 초대 코드 검증 응답:", response);
    return response;
  },

  // 로그인
  login: async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      credentials.email === "admin@naver.com" &&
      credentials.password === "rkddkwl123"
    ) {
      return {
        success: true,
        data: {
          token: "mock-jwt-token-123456789",
          admin_id: "admin_1",
          name: "관리자",
          role: "chief_manager",
        },
        message: "로그인 성공",
      };
    }

    return {
      success: false,
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  },

  // 회원가입
  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 초대 코드 확인
    if (userData.invite_code !== mockInviteCode.code) {
      return {
        success: false,
        message: "유효하지 않은 초대 코드입니다.",
      };
    }

    // 이메일 확인
    if (userData.email !== mockInviteCode.email) {
      return {
        success: false,
        message: "초대 코드에 등록된 이메일과 일치하지 않습니다.",
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: "user_" + Date.now(),
          name: userData.name,
          email: userData.email,
          role: mockInviteCode.role,
        },
      },
      message: "회원가입이 완료되었습니다.",
    };
  },
};

export const mockHashtagAPI = {
  // 해시태그 목록 조회
  getHashtags: async ({
    page = 1,
    limit = 50,
    search = "",
    sort_by = "usage_count",
    sort_order = "desc",
    type = "all",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 검색 및 필터링 로직
    let filteredHashtags = [...mockHashtags];

    if (search) {
      filteredHashtags = filteredHashtags.filter((hashtag) =>
        hashtag.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== "all") {
      filteredHashtags = filteredHashtags.filter(
        (hashtag) => hashtag.trend === type
      );
    }

    // 정렬 로직
    filteredHashtags.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;

      if (sort_by === "usage_count") {
        return order * (a.usage_count - b.usage_count);
      } else if (sort_by === "created_at") {
        return order * (new Date(a.created_at) - new Date(b.created_at));
      }

      return 0;
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHashtags = filteredHashtags.slice(startIndex, endIndex);

    const response = {
      success: true,
      data: {
        hashtags: paginatedHashtags,
        total_count: filteredHashtags.length,
        current_page: page,
        total_pages: Math.ceil(filteredHashtags.length / limit),
      },
    };

    console.log("해시태그 목록 API 응답:", response);
    return response;
  },

  // 해시태그 상세 조회
  getHashtagDetail: async (hashtagId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hashtag = mockHashtags.find((h) => h.id === hashtagId);
    if (!hashtag) {
      const errorResponse = {
        success: false,
        error: {
          message: "해시태그를 찾을 수 없습니다.",
        },
      };
      console.log("해시태그 상세 API 오류:", errorResponse);
      return errorResponse;
    }

    // 트렌드 데이터 생성
    const trendData = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      trendData.push({
        date: date.toISOString().split("T")[0],
        count:
          Math.floor(Math.random() * (hashtag.usage_count / 10)) +
          Math.floor(hashtag.usage_count / 20),
      });
    }

    // 관련 해시태그 생성
    const relatedHashtags = mockHashtags
      .filter((h) => h.id !== hashtagId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((h) => ({
        id: h.id,
        name: h.name,
        usage_count: h.usage_count,
        correlation: Math.random().toFixed(2),
      }));

    // 인기 게시물 생성
    const topPosts = Array.from({ length: 5 }, (_, i) => ({
      post_id: `post${i + 1}`,
      title: `인기 게시물 ${i + 1} with #${hashtag.name}`,
      like_count: Math.floor(Math.random() * 1000) + 100,
    }));

    const response = {
      success: true,
      data: {
        id: hashtag.id,
        name: hashtag.name,
        usage_count: hashtag.usage_count,
        created_at: hashtag.created_at,
        last_used_at: hashtag.last_used_at,
        trend: hashtag.trend,
        status: hashtag.status,
        trend_data: trendData,
        related_hashtags: relatedHashtags,
        top_posts: topPosts,
      },
    };

    console.log("해시태그 상세 API 응답:", response);
    return response;
  },

  // 해시태그 워드 클라우드 데이터
  getWordcloud: async ({ limit = 100, period = "month" }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cloudData = mockHashtags
      .map((h) => ({
        id: h.id,
        name: h.name,
        weight: Math.log(h.usage_count) * 10,
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);

    const response = {
      success: true,
      data: {
        hashtags: cloudData,
      },
    };

    console.log("해시태그 워드클라우드 API 응답:", response);
    return response;
  },

  // 해시태그 상태 변경
  updateHashtagStatus: async (hashtagId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("해시태그 상태 변경 요청:", { hashtagId, statusData });

    const hashtag = mockHashtags.find((h) => h.id === hashtagId);
    if (!hashtag) {
      const errorResponse = {
        success: false,
        error: {
          message: "해시태그를 찾을 수 없습니다.",
        },
      };
      console.log("해시태그 상태 변경 API 오류:", errorResponse);
      return errorResponse;
    }

    // 실제로는 여기서 해시태그 상태를 업데이트합니다
    hashtag.status = statusData.status;

    const response = {
      success: true,
      message: "해시태그 상태가 변경되었습니다",
    };

    console.log("해시태그 상태 변경 API 응답:", response);
    return response;
  },

  // 해시태그 통계 대시보드
  getHashtagStatistics: async ({ start_date, end_date }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("해시태그 통계 요청:", { start_date, end_date });

    // 새로운 해시태그 수 계산
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    const newHashtags = mockHashtags.filter(
      (h) =>
        new Date(h.created_at) >= startDateObj &&
        new Date(h.created_at) <= endDateObj
    ).length;

    // 트렌딩 해시태그 생성
    const trendingHashtags = mockHashtags
      .filter((h) => h.trend === "hot")
      .slice(0, 5)
      .map((h) => ({
        id: h.id,
        name: h.name,
        growth_rate: (Math.random() * 0.5 + 0.2).toFixed(2),
        usage_count: h.usage_count,
      }));

    // 일별 트렌드 데이터 생성
    const hashtagTrend = [];
    let currentDate = new Date(startDateObj);

    while (currentDate <= endDateObj) {
      const date = currentDate.toISOString().split("T")[0];
      const count = Math.floor(Math.random() * 100) + 50;
      const newCount = Math.floor(Math.random() * 20) + 5;

      hashtagTrend.push({ date, count, new_count: newCount });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const response = {
      success: true,
      data: {
        total_hashtags: mockHashtags.length,
        new_hashtags: newHashtags,
        trending_hashtags: trendingHashtags,
        hashtag_trend: hashtagTrend,
      },
    };

    console.log("해시태그 통계 API 응답:", response);
    return response;
  },
};

export const mockChatAPI = {
  // 채팅방 목록 조회
  getChatRooms: async ({
    page = 1,
    limit = 20,
    status = "all",
    search = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("채팅방 목록 요청:", { page, limit, status, search });

    let filteredRooms = [...mockChatRooms];

    // 검색어 필터링
    if (search) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.name.toLowerCase().includes(search.toLowerCase()) ||
          room.participants.some((p) =>
            p.username.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // 상태 필터링
    if (status !== "all") {
      filteredRooms = filteredRooms.filter((room) => room.status === status);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

    const response = {
      success: true,
      data: {
        rooms: paginatedRooms,
        total_count: filteredRooms.length,
        current_page: page,
        total_pages: Math.ceil(filteredRooms.length / limit),
      },
    };

    console.log("채팅방 목록 API 응답:", response);
    return response;
  },

  // 채팅방 상세 조회 - API 명세서 7.2에 맞게 수정
  getChatRoomDetail: async (roomId, { message_limit = 50 } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 채팅방 조회
    const room = mockChatRooms.find((r) => r.room_id === roomId);
    if (!room) {
      const errorResponse = {
        success: false,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "채팅방을 찾을 수 없습니다",
        },
      };
      console.log("채팅방 상세 API 오류:", errorResponse);
      throw new Error("채팅방을 찾을 수 없습니다");
    }

    // 채팅방 수준의 신고 배열 준비
    const roomReports = [];

    // 메시지 목록 생성
    const messages = Array.from(
      { length: Math.min(message_limit, room.message_count || 50) },
      (_, i) => {
        const participantIndex = Math.floor(
          Math.random() * room.participants.length
        );
        const participant = room.participants[participantIndex];
        const isReported = Math.random() > 0.9;
        const messageType = Math.random() > 0.7 ? "image" : "text";

        // 신고 정보 생성
        const messageReports = isReported
          ? Array.from(
              { length: Math.floor(Math.random() * 3) + 1 },
              (_, reportIndex) => ({
                report_id: `R${(i * 10 + reportIndex)
                  .toString()
                  .padStart(5, "0")}`,
                reporter_id: `USER${Math.floor(Math.random() * 1000)
                  .toString()
                  .padStart(5, "0")}`,
                reporter_name: `User ${Math.floor(Math.random() * 1000)}`,
                reason: ["욕설/비방", "스팸", "성희롱", "불법홍보", "기타"][
                  Math.floor(Math.random() * 5)
                ],
                status: ["pending", "resolved", "rejected"][
                  Math.floor(Math.random() * 3)
                ],
                created_at: new Date(
                  Date.now() - Math.random() * 5000000000
                ).toISOString(),
                message_id: `MSG${i.toString().padStart(5, "0")}`, // 메시지 ID 추가
              })
            )
          : [];

        // 테스트를 위해 첫 번째와 두 번째 메시지는 항상 신고가 있도록 설정
        const forcedReports =
          i < 2
            ? [
                {
                  report_id: `R${i}00${i}`,
                  reporter_id: `USER${(1000 + i).toString().padStart(5, "0")}`,
                  reporter_name: `Test Reporter ${i + 1}`,
                  reason: "테스트 신고 사유",
                  status: i === 0 ? "pending" : "resolved",
                  created_at: new Date().toISOString(),
                  message_id: `MSG${i.toString().padStart(5, "0")}`, // 메시지 ID 추가
                },
              ]
            : [];

        // 신고 정보를 채팅방 수준의 배열에 추가
        const thisMessageReports = i < 2 ? forcedReports : messageReports;
        if (thisMessageReports.length > 0) {
          roomReports.push(...thisMessageReports);
        }

        // 요청된 필드만 포함하는 메시지 객체 반환
        return {
          message_id: `MSG${i.toString().padStart(5, "0")}`,
          user_id: participant.user_id,
          username: participant.username,
          content: `메시지 내용 ${i + 1}`,
          type: messageType,
          created_at: new Date(
            Date.now() - Math.random() * 1000000000
          ).toISOString(),
          report_count: i < 2 ? forcedReports.length : messageReports.length,
          is_reported: i < 2 ? true : isReported,
        };
      }
    );

    // API 명세서 요구사항에 맞게 데이터 구성
    const response = {
      success: true,
      data: {
        room_id: room.room_id,
        name: room.name,
        type: room.type,
        status: room.status,
        created_at: room.created_at,
        last_message_at: room.last_message_at,
        participants: room.participants,
        message_count: room.message_count || messages.length,
        report_count: roomReports.length,
        messages: messages,
        reports: roomReports, // 채팅방 수준의 reports 배열 추가
      },
    };

    // 응답에 신고 정보가 있는지 확인하는 디버깅 로그
    console.log("채팅방 상세 API 응답 생성:", {
      메시지_총수: messages.length,
      신고된_메시지: messages.filter((m) => m.is_reported).length,
      신고_총수: roomReports.length,
      신고_예시: roomReports.slice(0, 2),
    });

    return response;
  },

  // 채팅방 상태 변경 - API 명세서 7.3에 맞게 수정
  updateChatRoomStatus: async (roomId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("채팅방 상태 변경 요청:", { roomId, statusData });

    const room = mockChatRooms.find((r) => r.room_id === roomId);
    if (!room) {
      const errorResponse = {
        success: false,
        error: {
          message: "채팅방을 찾을 수 없습니다",
        },
      };
      console.log("채팅방 상태 변경 API 오류:", errorResponse);
      throw new Error("채팅방을 찾을 수 없습니다");
    }

    // 상태 변경
    room.status = statusData.status;

    const response = {
      success: true,
      message: `채팅방 상태가 ${statusData.status}로 변경되었습니다`,
      data: {
        room_id: roomId,
        status: statusData.status,
        updated_at: new Date().toISOString(),
      },
    };

    console.log("채팅방 상태 변경 API 응답:", response);
    return response;
  },

  // 채팅 메시지 상태 변경 - API 명세서 7.4에 맞게 수정
  updateChatMessageStatus: async (messageId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("메시지 상태 변경 요청:", { messageId, statusData });

    // API 명세서에 맞는 필드들
    // - status: 'active', 'hidden', 'deleted'
    // - reason: 상태 변경 이유
    // - notify_user: 사용자에게 알림 여부

    const response = {
      success: true,
      message: `메시지 상태가 ${statusData.status}로 변경되었습니다`,
      data: {
        message_id: messageId,
        status: statusData.status,
        updated_at: new Date().toISOString(),
      },
    };

    console.log("메시지 상태 변경 API 응답:", response);
    return response;
  },

  // 신고 처리 - API 명세서 3.4에 맞게 추가
  processReport: async (reportId, reportData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("신고 처리 요청:", { reportId, reportData });

    // API 명세서에 맞는 필드들
    // - status: 상태(resolved, rejected)
    // - action_taken: 조치 내용(warn, suspend, delete_content, ban, none)
    // - comment: 처리 메모
    // - notify_reporter: 신고자에게 알림 여부
    // - notify_reported: 신고 대상자에게 알림 여부

    const response = {
      success: true,
      message: `신고가 ${reportData.status}로 처리되었습니다`,
      data: {
        report_id: reportId,
        status: reportData.status,
        action_taken: reportData.action_taken,
        processed_at: new Date().toISOString(),
      },
    };

    console.log("신고 처리 API 응답:", response);
    return response;
  },

  // 채팅방 신고 상태 변경
  updateReportStatus: async (reportId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("신고 상태 변경 요청:", { reportId, statusData });

    const response = {
      success: true,
      message: `신고 상태가 ${statusData.status}로 변경되었습니다`,
      data: {
        report_id: reportId,
        status: statusData.status,
        updated_at: new Date().toISOString(),
      },
    };

    console.log("신고 상태 변경 API 응답:", response);
    return response;
  },
};

export const mockPostAPI = {
  // 게시물 목록 조회
  getPosts: async ({
    page = 1,
    limit = 20,
    status = "all",
    search = "",
    user_id = "",
    sort_by = "created_at",
    sort_order = "desc",
    has_reports = false,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 필터링 로직
    let filteredPosts = [...mockPosts];

    // 상태 필터링
    if (status !== "all") {
      filteredPosts = filteredPosts.filter((post) => post.status === status);
    }

    // 검색어 필터링
    if (search) {
      filteredPosts = filteredPosts.filter((post) =>
        post.post_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 사용자 ID 필터링
    if (user_id) {
      filteredPosts = filteredPosts.filter((post) => post.user_id === user_id);
    }

    // 신고된 게시물만 필터링
    if (has_reports) {
      filteredPosts = filteredPosts.filter((post) => post.report_count > 0);
    }

    // 정렬 로직
    filteredPosts.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;

      if (sort_by === "created_at") {
        return order * (new Date(a.created_at) - new Date(b.created_at));
      } else {
        return order * (a[sort_by] - b[sort_by]);
      }
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        posts: paginatedPosts,
        total_count: filteredPosts.length,
        total_pages: Math.ceil(filteredPosts.length / limit),
        current_page: page,
      },
    };
  },

  // 게시물 상세 조회 (API 명세서 4.2에 맞춤)
  getPostDetail: async (postId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = mockPosts.find((p) => p.post_id === postId);
    if (!post) {
      return {
        success: false,
        error: {
          message: "게시물을 찾을 수 없습니다",
          code: "POST_NOT_FOUND",
        },
      };
    }

    const user = mockUsers.find((u) => u.user_id === post.user_id);
    const userName = user ? user.user_name : "알 수 없는 사용자";

    // 게시물 내용 생성
    const postNumber = parseInt(postId.substring(4));
    const contentLength = Math.min(2000, postNumber * 50);
    const postContent =
      `이것은 게시물 ${postId}의 내용입니다. 이 게시물은 테스트 목적으로 생성되었습니다.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget justo nec enim varius eleifend vel vitae nulla. Nullam elementum diam ut neque dictum, at lacinia sem interdum. Duis laoreet ante eget risus commodo, in tincidunt enim dictum.

${
  postNumber % 2 === 0
    ? "이 게시물은 짝수 번호를 가지고 있습니다."
    : "이 게시물은 홀수 번호를 가지고 있습니다."
}

한국어 콘텐츠와 영어 콘텐츠가 함께 포함되어 있는 테스트 게시물입니다. 이 게시물의 ID는 ${postId}입니다.`.substring(
        0,
        contentLength
      );

    // 이미지 URL 생성 (랜덤으로 0~4개)
    const imageCount = Math.floor(Math.random() * 5);
    const images = Array.from(
      { length: imageCount },
      (_, i) => `https://picsum.photos/800/600?random=${postId}${i}`
    );

    // 댓글 생성 (0~10개)
    const commentCount = Math.floor(Math.random() * 11);
    const comments = Array.from({ length: commentCount }, (_, i) => ({
      comment_id: `COMMENT${postId}_${i.toString().padStart(3, "0")}`,
      user_id: `USER${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(5, "0")}`,
      user_name: `댓글 작성자 ${i + 1}`,
      content: `게시물 ${postId}에 대한 댓글 ${
        i + 1
      }입니다. 이 댓글은 테스트용으로 작성되었습니다.`,
      created_at: new Date(
        Date.now() - Math.random() * 1000000000
      ).toISOString(),
      report_count: Math.floor(Math.random() * 3),
    }));

    // 신고 내역 생성
    const reports = Array.from({ length: post.report_count }, (_, i) => ({
      report_id: `R${postId}_${i.toString().padStart(3, "0")}`,
      reason: ["스팸", "불법컨텐츠", "욕설/비방", "사기", "기타"][
        Math.floor(Math.random() * 5)
      ],
      status: ["pending", "resolved", "rejected"][
        Math.floor(Math.random() * 3)
      ],
      reported_at: new Date(
        Date.now() - Math.random() * 10000000000
      ).toISOString(),
      reporter_id: `USER${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(5, "0")}`,
    }));

    return {
      success: true,
      data: {
        ...post,
        title: `게시물 제목 ${postNumber}`,
        post_content: postContent,
        user_name: userName,
        updated_at: new Date(
          new Date(post.created_at).getTime() + 86400000 * (Math.random() * 10)
        ).toISOString(),
        comment_count: commentCount,
        post_images: images,
        comments: comments,
        reports: reports,
        category: ["일상", "취미", "정보", "질문", "기타"][
          Math.floor(Math.random() * 5)
        ],
        address: Math.random() > 0.7 ? "서울특별시 강남구" : null,
        location:
          Math.random() > 0.7
            ? {
                lat: 37.5 + Math.random() * 0.1,
                lng: 127.0 + Math.random() * 0.1,
              }
            : null,
      },
    };
  },

  // 게시물 상태 변경 (API 명세서 4.3에 맞춤)
  updatePostStatus: async (postId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = mockPosts.find((p) => p.post_id === postId);
    if (!post) {
      return {
        success: false,
        error: {
          message: "게시물을 찾을 수 없습니다",
          code: "POST_NOT_FOUND",
        },
      };
    }

    // 허용된 상태 확인
    const allowedStatuses = ["active", "pending", "hidden", "deleted"];
    if (!allowedStatuses.includes(statusData.status)) {
      return {
        success: false,
        error: {
          message: "유효하지 않은 상태입니다",
          code: "INVALID_STATUS",
        },
      };
    }

    // 상태 업데이트
    post.status = statusData.status;

    // 알림 로직 (실제로는 구현하지 않음)
    const notificationSent = statusData.notify_user === true;

    return {
      success: true,
      data: {
        post_id: postId,
        status: post.status,
        updated_at: new Date().toISOString(),
        notification_sent: notificationSent,
      },
      message: `게시물 상태가 '${getStatusText(
        statusData.status
      )}'(으)로 변경되었습니다`,
    };
  },

  // 게시물 통계 대시보드 데이터
  getPostStatistics: async ({ start_date, end_date, interval }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const activePosts = mockPosts.filter(
      (post) => post.status === "active"
    ).length;
    const newPosts = mockPosts.filter(
      (post) => new Date(post.created_at) >= new Date(start_date)
    ).length;

    // 트렌드 데이터 생성
    const trend = [];
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    let currentDate = new Date(startDate);

    const getIntervalEndDate = (date, interval) => {
      const newDate = new Date(date);
      switch (interval) {
        case "weekly":
          newDate.setDate(date.getDate() + 7);
          break;
        case "monthly":
          newDate.setMonth(date.getMonth() + 1);
          break;
        default: // daily
          newDate.setDate(date.getDate() + 1);
      }
      return newDate;
    };

    while (currentDate <= endDate) {
      const intervalEndDate = getIntervalEndDate(currentDate, interval);

      // 해당 기간 내 게시물 수 계산
      const periodPosts = mockPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= currentDate && postDate < intervalEndDate;
      }).length;

      // 좋아요 및 조회수 랜덤 생성
      trend.push({
        date: currentDate.toISOString().split("T")[0],
        count: periodPosts,
        like_count: Math.floor(Math.random() * 500) + 100,
        view_count: Math.floor(Math.random() * 2000) + 500,
      });

      currentDate = intervalEndDate;
    }

    // 신고 통계 데이터
    const reportStats = {
      total: mockPostReports.length,
      pending: mockPostReports.filter((r) => r.status === "pending").length,
      resolved: mockPostReports.filter((r) => r.status === "resolved").length,
      by_category: [
        { category: "스팸", count: Math.floor(Math.random() * 50) },
        { category: "불법컨텐츠", count: Math.floor(Math.random() * 50) },
        { category: "욕설/비방", count: Math.floor(Math.random() * 30) },
        { category: "사기", count: Math.floor(Math.random() * 20) },
        { category: "기타", count: Math.floor(Math.random() * 20) },
      ],
    };

    return {
      success: true,
      data: {
        total_posts: mockPosts.length,
        new_posts: newPosts,
        active_posts: activePosts,
        post_trend: trend,
        report_stats: reportStats,
      },
    };
  },

  // 게시물 신고 검토 대기 목록 (API 명세서 4.5)
  getPendingReviews: async ({ page = 1, limit = 20 }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 신고가 1건 이상이고, status가 'pending'인 게시물만 추출
    const pendingPosts = mockPosts.filter(
      (post) => post.report_count > 0 && post.status === "pending"
    );
    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = pendingPosts.slice(startIndex, endIndex);
    return {
      success: true,
      data: {
        posts: paginated.map((post) => ({
          post_id: post.post_id,
          title: post.title || `게시물 제목 ${post.post_id}`,
          user_id: post.user_id,
          user_name:
            mockUsers.find((u) => u.user_id === post.user_id)?.user_name ||
            "알 수 없음",
          created_at: post.created_at,
          flag_reason: "신고 누적", // 예시
          severity: post.report_count,
        })),
        total_count: pendingPosts.length,
        current_page: page,
        total_pages: Math.ceil(pendingPosts.length / limit),
      },
    };
  },

  // 게시물 검토 승인/거부 (API 명세서 4.6)
  reviewPost: async (postId, reviewData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const post = mockPosts.find((p) => p.post_id === postId);
    if (!post) {
      return {
        success: false,
        message: "게시물을 찾을 수 없습니다.",
      };
    }
    // 승인/거부 처리
    if (reviewData.decision === "approve") {
      post.status = "active";
    } else if (reviewData.decision === "reject") {
      post.status = "deleted";
    }
    // 알림 여부 등은 실제로는 처리하지 않음
    return {
      success: true,
      message: "게시물 검토가 완료되었습니다",
      data: {
        post_id: postId,
        status: post.status,
        decision: reviewData.decision,
        reason: reviewData.reason,
        notify_user: reviewData.notify_user,
      },
    };
  },
};

// 상태 텍스트 변환 헬퍼 함수
function getStatusText(status) {
  switch (status) {
    case "active":
      return "활성";
    case "pending":
      return "대기 중";
    case "hidden":
      return "숨김";
    case "deleted":
      return "삭제됨";
    default:
      return "알 수 없음";
  }
}

// 매칭 API 모듈
export const mockMatchingAPI = {
  // 매칭 알고리즘 설정 조회
  getMatchingSettings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 응답 지연 시뮬레이션

    return {
      success: true,
      data: mockMatchingSettings,
    };
  },

  // 매칭 알고리즘 설정 업데이트
  updateMatchingSettings: async (settingsData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 설정 업데이트
    mockMatchingSettings = {
      ...mockMatchingSettings,
      ...settingsData,
      last_updated: new Date().toISOString(),
      updated_by: "ADMIN001", // 현재 로그인된 어드민 ID로 업데이트 필요
    };

    return {
      success: true,
      message: "매칭 설정이 업데이트되었습니다",
    };
  },

  // 매칭 통계 조회
  getMatchingStatistics: async ({ start_date, end_date, interval }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 날짜 필터링
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const filteredMatches = mockMatches.filter((match) => {
      const matchDate = new Date(match.created_at);
      return matchDate >= startDate && matchDate <= endDate;
    });

    // 성공한 매칭 수 계산
    const successfulMatches = filteredMatches.filter(
      (match) => match.status === "successful"
    ).length;

    // 매칭 점수 평균 계산
    const avgMatchScore =
      filteredMatches.length > 0
        ? filteredMatches.reduce((sum, match) => sum + match.score, 0) /
          filteredMatches.length
        : 0;

    // 트렌드 데이터 생성
    const matchTrend = [];
    let currentDate = new Date(startDate);

    // 타임라인 생성 함수
    const getIntervalEndDate = (date, interval) => {
      const newDate = new Date(date);
      switch (interval) {
        case "weekly":
          newDate.setDate(date.getDate() + 7);
          break;
        case "monthly":
          newDate.setMonth(date.getMonth() + 1);
          break;
        default: // daily
          newDate.setDate(date.getDate() + 1);
      }
      return newDate;
    };

    while (currentDate <= endDate) {
      const intervalEndDate = getIntervalEndDate(currentDate, interval);

      // 해당 기간의 매칭 수 계산
      const periodMatches = filteredMatches.filter((match) => {
        const matchDate = new Date(match.created_at);
        return matchDate >= currentDate && matchDate < intervalEndDate;
      });

      const periodSuccessCount = periodMatches.filter(
        (match) => match.status === "successful"
      ).length;
      const successRate =
        periodMatches.length > 0
          ? (periodSuccessCount / periodMatches.length) * 100
          : 0;

      matchTrend.push({
        date: currentDate.toISOString().split("T")[0],
        count: periodMatches.length,
        success_count: periodSuccessCount,
        success_rate: parseFloat(successRate.toFixed(2)),
      });

      currentDate = intervalEndDate;
    }

    // 매칭 요소별 분포 데이터
    const locationRanges = [
      { range: "0-5km", count: Math.floor(Math.random() * 100), percentage: 0 },
      {
        range: "5-15km",
        count: Math.floor(Math.random() * 150),
        percentage: 0,
      },
      {
        range: "15-30km",
        count: Math.floor(Math.random() * 80),
        percentage: 0,
      },
      { range: "30km+", count: Math.floor(Math.random() * 40), percentage: 0 },
    ];

    const interestCategories = [
      {
        category: "음악",
        count: Math.floor(Math.random() * 120),
        percentage: 0,
      },
      {
        category: "영화/드라마",
        count: Math.floor(Math.random() * 100),
        percentage: 0,
      },
      {
        category: "여행",
        count: Math.floor(Math.random() * 80),
        percentage: 0,
      },
      {
        category: "스포츠",
        count: Math.floor(Math.random() * 60),
        percentage: 0,
      },
      {
        category: "게임",
        count: Math.floor(Math.random() * 90),
        percentage: 0,
      },
      {
        category: "독서",
        count: Math.floor(Math.random() * 50),
        percentage: 0,
      },
    ];

    const ageRanges = [
      { range: "18-24", count: Math.floor(Math.random() * 120), percentage: 0 },
      { range: "25-34", count: Math.floor(Math.random() * 180), percentage: 0 },
      { range: "35-44", count: Math.floor(Math.random() * 100), percentage: 0 },
      { range: "45+", count: Math.floor(Math.random() * 60), percentage: 0 },
    ];

    // 백분율 계산
    const calculatePercentage = (items) => {
      const total = items.reduce((sum, item) => sum + item.count, 0);
      return items.map((item) => ({
        ...item,
        percentage: parseFloat(((item.count / total) * 100).toFixed(1)),
      }));
    };

    return {
      success: true,
      data: {
        total_matches: filteredMatches.length,
        successful_matches: successfulMatches,
        success_rate:
          parseFloat(
            ((successfulMatches / filteredMatches.length) * 100).toFixed(2)
          ) || 0,
        average_match_score: parseFloat(avgMatchScore.toFixed(2)),
        match_trend: matchTrend,
        match_distribution_by_factors: {
          location: calculatePercentage(locationRanges),
          interests: calculatePercentage(interestCategories),
          age: calculatePercentage(ageRanges),
        },
      },
    };
  },

  // 매칭 히스토리 조회
  getMatchingHistory: async ({
    page = 1,
    limit = 20,
    status = "all",
    user_id = "",
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredMatches = [...mockMatches];

    // 상태 필터링
    if (status !== "all") {
      filteredMatches = filteredMatches.filter(
        (match) => match.status === status
      );
    }

    // 특정 사용자 필터링
    if (user_id) {
      filteredMatches = filteredMatches.filter(
        (match) => match.user1_id === user_id || match.user2_id === user_id
      );
    }

    // 정렬 (최신순)
    filteredMatches.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        matches: paginatedMatches,
        total_count: filteredMatches.length,
        current_page: page,
        total_pages: Math.ceil(filteredMatches.length / limit),
      },
    };
  },

  // 매칭 상세 조회
  getMatchDetail: async (matchId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const match = mockMatches.find((m) => m.match_id === matchId);

    if (!match) {
      return {
        success: false,
        error: {
          code: "MATCH_NOT_FOUND",
          message: "매칭 정보를 찾을 수 없습니다",
        },
      };
    }

    // 랜덤 사용자 상세 정보 생성
    const generateUserDetail = (userId, username) => {
      return {
        user_id: userId,
        username: username,
        age: Math.floor(Math.random() * 30) + 20,
        gender: Math.random() > 0.5 ? "남성" : "여성",
        location: ["서울", "부산", "인천", "대구", "광주"][
          Math.floor(Math.random() * 5)
        ],
        interests: [
          "음악",
          "영화",
          "여행",
          "스포츠",
          "게임",
          "독서",
          "요리",
          "댄스",
          "사진",
          "미술",
        ]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 5) + 2),
      };
    };

    // 요소별 점수 생성
    const factorScores = {
      location: parseFloat((Math.random() * 100).toFixed(1)),
      interests: parseFloat((Math.random() * 100).toFixed(1)),
      age: parseFloat((Math.random() * 100).toFixed(1)),
      gender: parseFloat((Math.random() * 100).toFixed(1)),
      activity_level: parseFloat((Math.random() * 100).toFixed(1)),
    };

    // 매칭 지속 시간 (분)
    const matchDuration =
      match.status === "failed" ? 0 : Math.floor(Math.random() * 1000) + 1;

    return {
      success: true,
      data: {
        match_id: match.match_id,
        user1: generateUserDetail(match.user1_id, match.user1_name),
        user2: generateUserDetail(match.user2_id, match.user2_name),
        created_at: match.created_at,
        score: match.score,
        factor_scores: factorScores,
        status: match.status,
        chat_room_id: match.chat_room_id,
        message_count: match.message_count,
        match_duration: matchDuration,
      },
    };
  },
};

// 관리자 역할별 기본 권한 Helper 함수
function getDefaultPermissionsByRole(role) {
  const permissionsByRole = {
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

  return permissionsByRole[role] || [];
}

// 관리자 상태 메시지 Helper 함수
function getAdminStatusMessage(status) {
  switch (status) {
    case "active":
      return "관리자 계정이 활성화되었습니다";
    case "suspended":
      return "관리자 계정이 일시 정지되었습니다";
    case "deleted":
      return "관리자 계정이 삭제되었습니다";
    default:
      return "관리자 상태가 변경되었습니다";
  }
}

export const mockAdminAPI = {
  // 관리자 목록 조회
  getAdmins: async ({ page = 1, limit = 20, search = "", role = "all" }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredAdmins = [...mockAdmins];

    // 검색어 필터링
    if (search) {
      filteredAdmins = filteredAdmins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 역할 필터링
    if (role !== "all") {
      filteredAdmins = filteredAdmins.filter((admin) => admin.role === role);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        admins: paginatedAdmins,
        total_count: filteredAdmins.length,
        total_pages: Math.ceil(filteredAdmins.length / limit),
        current_page: page,
      },
    };
  },

  // 관리자 상세 조회
  getAdminDetail: async (adminId) => {
    console.log("[mockAPI] getAdminDetail adminId:", adminId);
    console.log(
      "[mockAPI] mockAdmins:",
      mockAdmins.map((a) => a.admin_id)
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    const admin = mockAdmins.find((a) => a.admin_id === adminId);
    if (!admin) {
      return {
        success: false,
        error: {
          message: "관리자를 찾을 수 없습니다",
          code: "ADMIN_NOT_FOUND",
        },
      };
    }

    // 최근 활동 로그 조회
    const activityLog = mockActivityLogs
      .filter((log) => log.admin_id === adminId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map((log) => ({
        action: log.action,
        timestamp: log.timestamp,
        details: log.details,
      }));

    return {
      success: true,
      data: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions:
          admin.custom_permissions || getDefaultPermissionsByRole(admin.role),
        status: admin.status,
        last_login_at: admin.last_login_at,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
        activity_log: activityLog,
      },
    };
  },

  // 관리자 역할 업데이트
  updateAdminRole: async (adminId, roleData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const admin = mockAdmins.find((a) => a.admin_id === adminId);
    if (!admin) {
      return {
        success: false,
        error: {
          message: "관리자를 찾을 수 없습니다",
          code: "ADMIN_NOT_FOUND",
        },
      };
    }

    // 역할 검증
    const validRoles = [
      "chief_manager",
      "post_manager",
      "chat_manager",
      "user_manager",
      "data_manager",
    ];
    if (!validRoles.includes(roleData.role)) {
      return {
        success: false,
        error: {
          message: "유효하지 않은 역할입니다",
          code: "INVALID_ROLE",
        },
      };
    }

    // 기존 역할
    const oldRole = admin.role;

    // 역할 업데이트
    admin.role = roleData.role;

    // 권한 업데이트 (선택적)
    if (roleData.permissions && Array.isArray(roleData.permissions)) {
      admin.custom_permissions = roleData.permissions;
    } else if (oldRole !== roleData.role) {
      // 역할이 변경되었는데 권한이 지정되지 않은 경우 custom_permissions를 제거하여 기본 권한 사용
      delete admin.custom_permissions;
    }

    // 마지막 업데이트 시간 저장
    admin.updated_at = new Date().toISOString();

    // 활동 로그 추가
    mockActivityLogs.push({
      log_id: `LOG${(mockActivityLogs.length + 1).toString().padStart(6, "0")}`,
      admin_id: "ADMIN0001", // 현재 로그인한 관리자 ID (예시)
      admin_name: "최고관리자", // 현재 로그인한 관리자 이름 (예시)
      action: "관리자 역할 변경",
      timestamp: new Date().toISOString(),
      details: {
        description: `관리자 ${admin.name}의 역할을 ${roleData.role}로 변경했습니다.`,
        target_id: adminId,
        target_type: "admin",
        before_value: oldRole,
        after_value: roleData.role,
        permissions: roleData.permissions || [],
      },
      ip_address: "192.168.1.1", // 예시 IP
    });

    return {
      success: true,
      message: `관리자 역할이 ${roleData.role}로 변경되었습니다`,
      data: {
        admin_id: adminId,
        role: admin.role,
        permissions: admin.custom_permissions || [],
        updated_at: admin.updated_at,
      },
    };
  },

  // 관리자 상태 업데이트
  updateAdminStatus: async (adminId, statusData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const admin = mockAdmins.find((a) => a.admin_id === adminId);
    if (!admin) {
      return {
        success: false,
        error: {
          message: "관리자를 찾을 수 없습니다",
          code: "ADMIN_NOT_FOUND",
        },
      };
    }

    // 상태 검증
    const validStatuses = ["active", "suspended", "deleted"];
    if (!validStatuses.includes(statusData.status)) {
      return {
        success: false,
        error: {
          message: "유효하지 않은 상태입니다",
          code: "INVALID_STATUS",
        },
      };
    }

    // 상태 업데이트
    const oldStatus = admin.status;
    admin.status = statusData.status;

    // 활동 로그 추가
    mockActivityLogs.push({
      log_id: `LOG${(mockActivityLogs.length + 1).toString().padStart(6, "0")}`,
      admin_id: "ADMIN0001", // 현재 로그인한 관리자 ID (예시)
      admin_name: "최고관리자", // 현재 로그인한 관리자 이름 (예시)
      action: "관리자 상태 변경",
      timestamp: new Date().toISOString(),
      details: {
        description: `관리자 ${admin.name}의 상태를 ${statusData.status}로 변경했습니다.`,
        target_id: adminId,
        target_type: "admin",
        before_value: oldStatus,
        after_value: statusData.status,
      },
      ip_address: "192.168.1.1", // 예시 IP
    });

    return {
      success: true,
      message: getAdminStatusMessage(statusData.status),
      data: {
        admin_id: adminId,
        status: admin.status,
        updated_at: new Date().toISOString(),
      },
    };
  },

  // 활동 로그 조회
  getActivityLog: async ({
    page = 1,
    limit = 20,
    admin_id = null,
    action_type = null,
    start_date = null,
    end_date = null,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredLogs = [...mockActivityLogs];

    // 관리자 ID 필터링
    if (admin_id) {
      filteredLogs = filteredLogs.filter((log) => log.admin_id === admin_id);
    }

    // 작업 유형 필터링
    if (action_type) {
      filteredLogs = filteredLogs.filter((log) => log.action === action_type);
    }

    // 날짜 필터링
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    // 최신순 정렬
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        logs: paginatedLogs,
        total_count: filteredLogs.length,
        total_pages: Math.ceil(filteredLogs.length / limit),
        current_page: page,
      },
    };
  },
};

// 대시보드 API mock
export const mockDashboardAPI = {
  // 10.1 메인 대시보드 데이터
  getMain: async ({ period = "month" } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        user_stats: {
          total: 12345,
          new: 123,
          active: 4567,
          growth: 2.5,
        },
        content_stats: {
          total_posts: 6789,
          new_posts: 234,
          pending_review: 12,
          comment_count: 8901,
        },
        report_stats: {
          total: 321,
          pending: 8,
          resolved: 300,
          by_category: [
            { category: "스팸", count: 120 },
            { category: "욕설", count: 80 },
            { category: "기타", count: 121 },
          ],
        },
        matching_stats: {
          total_matches: 5000,
          success_rate: 78.2,
          active_chats: 120,
        },
        recent_activity: [
          {
            type: "user_signup",
            timestamp: new Date().toISOString(),
            details: { user_id: "USER001" },
          },
          {
            type: "post_created",
            timestamp: new Date().toISOString(),
            details: { post_id: "POST001" },
          },
        ],
      },
    };
  },
  // 10.2 사용자 성장 트렌드
  getUserTrends: async ({ start_date, end_date, interval }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const start = new Date(start_date);
    const end = new Date(end_date);
    const result = [];
    let current = new Date(start);
    while (current <= end) {
      result.push({
        date: current.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 20) + 1,
      });
      if (interval === "monthly") {
        current.setMonth(current.getMonth() + 1);
      } else if (interval === "weekly") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }
    return {
      success: true,
      data: {
        signup_trend: result,
        active_trend: result.map((d) => ({
          date: d.date,
          count: d.count + 10,
        })),
        retention_trend: result.map((d) => ({
          date: d.date,
          rate: 80 - d.count,
        })),
        user_demographics: (() => {
          // 연령대 분포
          const ageRanges = ["10-19", "20-29", "30-39", "40+"];
          const ageCounts = ageRanges.map(
            () => Math.floor(Math.random() * 300) + 50
          );
          const ageTotal = ageCounts.reduce((a, b) => a + b, 0);
          const by_age = ageRanges.map((range, i) => ({
            range,
            count: ageCounts[i],
            percentage: parseFloat(
              ((ageCounts[i] / ageTotal) * 100).toFixed(1)
            ),
          }));

          // 성별 분포
          const genderTypes = ["남성", "여성"];
          const genderCounts = genderTypes.map(
            () => Math.floor(Math.random() * 500) + 100
          );
          const genderTotal = genderCounts.reduce((a, b) => a + b, 0);
          const by_gender = genderTypes.map((gender, i) => ({
            gender,
            count: genderCounts[i],
            percentage: parseFloat(
              ((genderCounts[i] / genderTotal) * 100).toFixed(1)
            ),
          }));

          // 한국 주요 지역 분포 (전국팔도 + 제주)
          const locations = [
            "서울",
            "부산",
            "대구",
            "인천",
            "광주",
            "대전",
            "울산",
            "경기",
            "강원",
            "충북",
            "충남",
            "전북",
            "전남",
            "경북",
            "경남",
            "제주",
          ];
          const locationCounts = locations.map(
            () => Math.floor(Math.random() * 200) + 30
          );
          const locationTotal = locationCounts.reduce((a, b) => a + b, 0);
          const by_location = locations.map((location, i) => ({
            location,
            count: locationCounts[i],
            percentage: parseFloat(
              ((locationCounts[i] / locationTotal) * 100).toFixed(1)
            ),
          }));

          return {
            by_age,
            by_gender,
            by_location,
          };
        })(),
      },
    };
  },
  // 10.3 콘텐츠 활동 트렌드
  getContentTrends: async ({ start_date, end_date, interval }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const start = new Date(start_date);
    const end = new Date(end_date);
    const result = [];
    let current = new Date(start);
    while (current <= end) {
      result.push({
        date: current.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 30) + 10,
      });
      if (interval === "monthly") {
        current.setMonth(current.getMonth() + 1);
      } else if (interval === "weekly") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }
    return {
      success: true,
      data: {
        post_trend: result,
        comment_trend: result.map((d) => ({
          date: d.date,
          count: Math.floor(Math.random() * 15) + 5,
        })),
        engagement_trend: result.map((d) => ({
          date: d.date,
          likes: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 10),
        })),
        top_content: {
          posts: Array.from({ length: 5 }, (_, i) => ({
            post_id: `POST${(i + 1).toString().padStart(3, "0")}`,
            title: `인기 게시물 ${i + 1}`,
            engagement: Math.floor(Math.random() * 2000) + 100,
          })),
          hashtags: Array.from({ length: 5 }, (_, i) => ({
            id: `${i + 1}`,
            name: `#인기해시태그${i + 1}`,
            usage_count: Math.floor(Math.random() * 1000) + 50,
          })),
        },
      },
    };
  },
  // 10.4 시스템 성능 모니터링
  getSystemPerformance: async ({
    start_date,
    end_date,
    interval = "daily",
  } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 날짜 범위 생성
    const start = start_date ? new Date(start_date) : new Date();
    const end = end_date ? new Date(end_date) : new Date();
    if (!start_date || !end_date) {
      end.setDate(end.getDate());
      start.setDate(end.getDate() - 6);
    }
    const resultDates = [];
    let current = new Date(start);
    while (current <= end) {
      resultDates.push(new Date(current));
      if (interval === "monthly") {
        current.setMonth(current.getMonth() + 1);
      } else if (interval === "weekly") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    // mock 데이터 생성
    const api_requests = resultDates.map((d, i) => ({
      timestamp: d.toISOString(),
      count: 1000 + Math.floor(Math.random() * 200) + i * 10,
      avg_response_time: 100 + Math.floor(Math.random() * 50),
    }));
    const errors = resultDates.map((d, i) => ({
      timestamp: d.toISOString(),
      count: Math.floor(Math.random() * 10),
      top_errors: [
        {
          type: "DB",
          count: Math.floor(Math.random() * 5) + 1,
          percentage: 50,
        },
        {
          type: "Timeout",
          count: Math.floor(Math.random() * 3) + 1,
          percentage: 30,
        },
        {
          type: "Auth",
          count: Math.floor(Math.random() * 2) + 1,
          percentage: 20,
        },
      ],
    }));
    const resource_usage = {
      cpu: resultDates.map((d) => ({
        timestamp: d.toISOString(),
        usage: 30 + Math.floor(Math.random() * 70),
      })),
      memory: resultDates.map((d) => ({
        timestamp: d.toISOString(),
        usage: 50 + Math.floor(Math.random() * 50),
      })),
      disk: resultDates.map((d) => ({
        timestamp: d.toISOString(),
        usage: 40 + Math.floor(Math.random() * 60),
      })),
    };

    return {
      success: true,
      data: {
        api_requests,
        errors,
        resource_usage,
      },
    };
  },

  // 통합 트렌드 데이터
  getTrends: (params) => {
    const { start_date, end_date, interval } = params;
    const start = new Date(start_date);
    const end = new Date(end_date);

    // 날짜 범위에 따른 데이터 생성
    const trends = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // 각 날짜별 랜덤 데이터 생성
      trends.push({
        date: dateStr,
        new_users: Math.floor(Math.random() * 50) + 1,
        new_posts: Math.floor(Math.random() * 30) + 1,
        total_reports: Math.floor(Math.random() * 20) + 1,
      });

      // interval에 따라 다음 날짜 계산
      switch (interval) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return Promise.resolve({
      success: true,
      data: {
        trends,
      },
    });
  },
};

// 시스템 설정 mock 데이터
let mockSystemSettings = {
  general: {
    site_name: "테스트 사이트",
    site_description: "이것은 mock 시스템 설정입니다.",
    contact_email: "admin@example.com",
    support_email: "support@example.com",
  },
  security: {
    login_attempts: 5,
    lockout_duration: 30,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special_chars: false,
    },
  },
  content: {
    max_post_length: 2000,
    max_comment_length: 500,
    auto_review_triggers: ["금지어", "신고누적"],
    banned_words: ["욕설", "비방", "스팸"],
  },
  notification: {
    email_notifications: true,
    push_notifications: true,
    digest_frequency: "daily",
  },
};

let mockBannedWords = ["욕설", "비방", "스팸"];
let mockBannedWordsLastUpdated = new Date().toISOString();
let mockBannedWordsUpdatedBy = "admin";

let mockApiKeys = [
  {
    id: "key1",
    name: "테스트키1",
    prefix: "test1",
    created_at: new Date().toISOString(),
    expires_at: null,
    last_used_at: null,
    created_by: "admin",
    permissions: ["read", "write"],
  },
];

export const mockSettingsAPI = {
  // 시스템 설정 조회
  getSystemSettings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: mockSystemSettings };
  },
  // 시스템 설정 업데이트
  updateSystemSettings: async (settingsData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockSystemSettings = { ...mockSystemSettings, ...settingsData };
    return { success: true, message: "시스템 설정이 업데이트되었습니다" };
  },
  // 금지어 목록 조회 (API 명세서 11.3)
  getBannedWords: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      data: {
        words: mockBannedWords,
        last_updated: mockBannedWordsLastUpdated,
        updated_by: mockBannedWordsUpdatedBy,
      },
    };
  },
  // 금지어 목록 추가/삭제 (API 명세서 11.3)
  updateBannedWords: async (words, action, updatedBy = "admin") => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (action === "add") {
      mockBannedWords = Array.from(new Set([...mockBannedWords, ...words]));
    } else if (action === "remove") {
      mockBannedWords = mockBannedWords.filter((w) => !words.includes(w));
    }
    mockBannedWordsLastUpdated = new Date().toISOString();
    mockBannedWordsUpdatedBy = updatedBy;
    return { success: true, message: "금지어 목록이 업데이트되었습니다" };
  },
  // API 키 목록 조회
  getApiKeys: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, data: { keys: mockApiKeys } };
  },
  // API 키 생성
  createApiKey: async (keyData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newKey = {
      id: `key${mockApiKeys.length + 1}`,
      name: keyData.name,
      prefix: keyData.name.toLowerCase(),
      created_at: new Date().toISOString(),
      expires_at: keyData.expires_in
        ? new Date(
            Date.now() + keyData.expires_in * 24 * 60 * 60 * 1000
          ).toISOString()
        : null,
      last_used_at: null,
      created_by: "admin",
      permissions: keyData.permissions || ["read"],
    };
    mockApiKeys.push(newKey);
    return {
      success: true,
      data: {
        id: newKey.id,
        key: `mock-key-${newKey.id}`,
        name: newKey.name,
        prefix: newKey.prefix,
        expires_at: newKey.expires_at,
      },
      message: "API 키가 생성되었습니다",
    };
  },
  // API 키 삭제
  deleteApiKey: async (keyId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockApiKeys = mockApiKeys.filter((k) => k.id !== keyId);
    return { success: true, message: "API 키가 삭제되었습니다" };
  },
};

export const mockReportsAnalyticsAPI = {
  // 12.1 사용자 분석 보고서
  getUserAnalytics: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    // 날짜 파라미터 파싱
    const {
      start_date,
      end_date,
      metrics = "signup,retention,engagement",
    } = params || {};
    const metricsArr = metrics.split(",").map((m) => m.trim());
    // 날짜 범위에 따라 mockUsers에서 집계
    const start = start_date ? new Date(start_date) : new Date("2024-06-01");
    const end = end_date ? new Date(end_date) : new Date("2024-06-30");
    // 전체 mockUsers, 기간 내 신규, 활성 등 샘플 생성
    const total_users = mockUsers.length;
    const new_users = mockUsers.filter(
      (u) => new Date(u.created_at) >= start && new Date(u.created_at) <= end
    ).length;
    const active_users = mockUsers.filter((u) => u.status === "Active").length;
    // 리텐션, 참여 등은 랜덤/샘플
    const churn_rate = (Math.random() * 5 + 1).toFixed(1); // 1~6%
    const retention = {
      day1: Math.floor(Math.random() * 30) + 50, // 50~80%
      day7: Math.floor(Math.random() * 20) + 30, // 30~50%
      day30: Math.floor(Math.random() * 20) + 10, // 10~30%
    };
    const engagement = {
      dau: Math.floor(total_users * 0.2),
      wau: Math.floor(total_users * 0.5),
      mau: Math.floor(total_users * 0.8),
      dau_wau_ratio: (Math.random() * 0.5 + 0.2).toFixed(2),
      sessions_per_user: (Math.random() * 2 + 2).toFixed(1),
      avg_session_duration: (Math.random() * 10 + 10).toFixed(1),
    };
    // 인구통계 샘플
    const age_distribution = [
      { range: "10-19", count: Math.floor(total_users * 0.1), percentage: 10 },
      { range: "20-29", count: Math.floor(total_users * 0.4), percentage: 40 },
      { range: "30-39", count: Math.floor(total_users * 0.3), percentage: 30 },
      {
        range: "40+",
        count:
          total_users -
          Math.floor(total_users * 0.1) -
          Math.floor(total_users * 0.4) -
          Math.floor(total_users * 0.3),
        percentage: 20,
      },
    ];
    const gender_distribution = [
      { gender: "남성", count: Math.floor(total_users * 0.6), percentage: 60 },
      {
        gender: "여성",
        count: total_users - Math.floor(total_users * 0.6),
        percentage: 40,
      },
    ];
    const location_distribution = [
      {
        location: "서울",
        count: Math.floor(total_users * 0.3),
        percentage: 30,
      },
      {
        location: "부산",
        count: Math.floor(total_users * 0.1),
        percentage: 10,
      },
      {
        location: "기타",
        count:
          total_users -
          Math.floor(total_users * 0.3) -
          Math.floor(total_users * 0.1),
        percentage: 60,
      },
    ];
    // metrics별로 데이터 포함/제외
    const overview = {
      total_users: metricsArr.includes("signup") ? total_users : null,
      active_users: metricsArr.includes("engagement") ? active_users : null,
      new_users: metricsArr.includes("signup") ? new_users : null,
      churn_rate: metricsArr.includes("retention") ? churn_rate : null,
    };
    return {
      success: true,
      data: {
        overview,
        retention: metricsArr.includes("retention") ? retention : null,
        engagement: metricsArr.includes("engagement") ? engagement : null,
        demographics: {
          age_distribution,
          gender_distribution,
          location_distribution,
        },
      },
    };
  },
  // 12.2 콘텐츠 분석 보고서
  getContentAnalytics: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    const { content_type = "all" } = params || {};
    // 기본 mock 데이터
    let overview = {
      total_posts: 5000,
      total_comments: 20000,
      avg_likes_per_post: 12.3,
      avg_comments_per_post: 4.5,
    };
    let engagement = {
      most_liked_posts: [
        { post_id: "POST001", title: "인기 게시물 1", like_count: 300 },
      ],
      most_commented_posts: [
        { post_id: "POST002", title: "댓글 많은 게시물", comment_count: 50 },
      ],
      engagement_by_time: [
        { hour: 10, post_count: 100, like_count: 200, comment_count: 50 },
      ],
    };
    let content_trends = {
      posts_by_day: [
        { date: "2024-06-01", count: 100 },
        { date: "2024-06-02", count: 120 },
      ],
      comments_by_day: [
        { date: "2024-06-01", count: 300 },
        { date: "2024-06-02", count: 350 },
      ],
      likes_by_day: [
        { date: "2024-06-01", count: 500 },
        { date: "2024-06-02", count: 600 },
      ],
    };
    let top_hashtags = [
      { name: "여행", count: 100, percentage: 10 },
      { name: "음식", count: 80, percentage: 8 },
    ];
    if (content_type === "posts") {
      overview = {
        ...overview,
        total_comments: 0,
        avg_comments_per_post: 0,
      };
      engagement = {
        ...engagement,
        most_commented_posts: [],
        engagement_by_time: engagement.engagement_by_time.map((e) => ({
          ...e,
          comment_count: 0,
        })),
      };
      content_trends = {
        ...content_trends,
        comments_by_day: content_trends.comments_by_day.map((d) => ({
          ...d,
          count: 0,
        })),
      };
    } else if (content_type === "comments") {
      overview = {
        ...overview,
        total_posts: 0,
        avg_likes_per_post: 0,
      };
      engagement = {
        ...engagement,
        most_liked_posts: [],
        engagement_by_time: engagement.engagement_by_time.map((e) => ({
          ...e,
          like_count: 0,
          post_count: 0,
        })),
      };
      content_trends = {
        ...content_trends,
        posts_by_day: content_trends.posts_by_day.map((d) => ({
          ...d,
          count: 0,
        })),
        likes_by_day: content_trends.likes_by_day.map((d) => ({
          ...d,
          count: 0,
        })),
      };
    }
    return {
      success: true,
      data: {
        overview,
        engagement,
        content_trends,
        top_hashtags,
      },
    };
  },
  // 12.3 매칭 분석 보고서
  getMatchingAnalytics: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      data: {
        overview: {
          total_matches: 1000,
          successful_matches: 800,
          success_rate: 80,
          avg_match_score: 75.5,
        },
        match_quality: {
          score_distribution: [
            { range: "60-70", count: 200, percentage: 20 },
            { range: "70-80", count: 400, percentage: 40 },
          ],
          factor_influence: [
            { factor: "관심사", influence: 0.5 },
            { factor: "위치", influence: 0.3 },
          ],
        },
        user_experience: {
          avg_time_to_match: 5.2,
          avg_messages_per_match: 10.1,
          rematch_rate: 0.15,
          satisfaction_score: 4.2,
        },
        trends: {
          matches_by_day: [
            { date: "2024-06-01", count: 30, success_count: 25 },
          ],
          success_rate_by_day: [{ date: "2024-06-01", rate: 80 }],
        },
      },
    };
  },
  // 12.4 모더레이션 활동 보고서
  getModerationAnalytics: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    const { type = "all" } = params || {};
    // 기본 mock 데이터
    let overview = {
      total_reports: 500,
      resolved_reports: 400,
      rejected_reports: 50,
      avg_resolution_time: 2.5,
    };
    let reports_by_type = [
      { type: "user", count: 200, percentage: 40 },
      { type: "post", count: 150, percentage: 30 },
      { type: "chat", count: 150, percentage: 30 },
    ];
    let reports_by_reason = [
      { reason: "스팸", count: 100, percentage: 20 },
      { reason: "욕설", count: 80, percentage: 16 },
      { reason: "기타", count: 320, percentage: 64 },
    ];
    let actions_taken = [
      { action: "경고", count: 50, percentage: 10 },
      { action: "정지", count: 30, percentage: 6 },
      { action: "삭제", count: 20, percentage: 4 },
      { action: "기타", count: 400, percentage: 80 },
    ];
    let admin_activity = [
      {
        admin_id: "ADMIN001",
        admin_name: "관리자1",
        reports_processed: 100,
        avg_resolution_time: 2.1,
      },
      {
        admin_id: "ADMIN002",
        admin_name: "관리자2",
        reports_processed: 50,
        avg_resolution_time: 3.0,
      },
    ];
    let trends = {
      reports_by_day: [
        { date: "2024-06-01", count: 10, resolved_count: 8 },
        { date: "2024-06-02", count: 12, resolved_count: 10 },
      ],
      resolution_time_by_day: [
        { date: "2024-06-01", avg_time: 2.5 },
        { date: "2024-06-02", avg_time: 2.8 },
      ],
    };
    // type별 분기
    if (type === "user") {
      overview = {
        ...overview,
        total_reports: 200,
        resolved_reports: 160,
        rejected_reports: 20,
      };
      reports_by_type = [{ type: "user", count: 200, percentage: 100 }];
      reports_by_reason = [
        { reason: "스팸", count: 60, percentage: 30 },
        { reason: "욕설", count: 40, percentage: 20 },
        { reason: "기타", count: 100, percentage: 50 },
      ];
    } else if (type === "post") {
      overview = {
        ...overview,
        total_reports: 150,
        resolved_reports: 120,
        rejected_reports: 15,
      };
      reports_by_type = [{ type: "post", count: 150, percentage: 100 }];
      reports_by_reason = [
        { reason: "스팸", count: 30, percentage: 20 },
        { reason: "욕설", count: 20, percentage: 13 },
        { reason: "기타", count: 100, percentage: 67 },
      ];
    } else if (type === "chat") {
      overview = {
        ...overview,
        total_reports: 150,
        resolved_reports: 120,
        rejected_reports: 15,
      };
      reports_by_type = [{ type: "chat", count: 150, percentage: 100 }];
      reports_by_reason = [
        { reason: "욕설", count: 20, percentage: 13 },
        { reason: "기타", count: 130, percentage: 87 },
      ];
    }
    return {
      success: true,
      data: {
        overview,
        reports_by_type,
        reports_by_reason,
        actions_taken,
        admin_activity,
        trends,
      },
    };
  },
  // 12.5 커스텀 보고서 생성
  createCustomReport: async (data) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      data: {
        report_id: "custom_001",
        download_url: "https://example.com/report/custom_001.pdf",
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
      message: "보고서가 생성되었습니다",
    };
  },
  // 12.6 정기 보고서 설정 (조회/생성)
  getScheduledReports: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      data: {
        reports: [
          {
            id: "scheduled_001",
            name: "주간 사용자 분석",
            description: "매주 월요일 오전 9시에 발송",
            frequency: "weekly",
            next_run_at: new Date(Date.now() + 3600000).toISOString(),
            created_by: "admin",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      },
    };
  },
  createScheduledReport: async (data) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      data: {
        id: "scheduled_002",
        next_run_at: new Date(Date.now() + 3600000).toISOString(),
      },
      message: "정기 보고서가 설정되었습니다",
    };
  },
  // 12.7 보고서 히스토리 조회
  getReportHistory: async (params) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      data: {
        reports: [
          {
            id: "history_001",
            name: "5월 사용자 분석",
            type: "user",
            created_at: "2024-06-01T09:00:00Z",
            created_by: "admin",
            download_url: "https://example.com/report/history_001.pdf",
            expires_at: new Date(Date.now() + 86400000).toISOString(),
          },
        ],
        total_count: 1,
        current_page: 1,
        total_pages: 1,
      },
    };
  },
};

// mock 관리자 프로필 정보를 localStorage에 자동 세팅하는 헬퍼 함수
export function setMockAdminProfile({
  admin_id = "ADMIN0001",
  name = "모의 관리자",
  role = "chief_manager",
} = {}) {
  if (!localStorage.getItem("admin_id")) {
    localStorage.setItem("admin_id", admin_id);
    localStorage.setItem("admin_name", name);
    localStorage.setItem("admin_role", role);
  }
}

// mockInquiryAPI와 동일한 기능을 하는 mockInquiriesAPI 추가
export const mockInquiriesAPI = {
  getInquiries: async ({
    page = 1,
    limit = 10,
    status = "all",
    sort_by = "created_at",
    sort_order = "desc",
  }) => {
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...mockInquiries];
    if (status !== "all")
      filtered = filtered.filter((i) => i.status === status);

    // 정렬 추가
    filtered.sort((a, b) => {
      const order = sort_order === "desc" ? -1 : 1;
      if (sort_by === "created_at") {
        return order * (new Date(a.created_at) - new Date(b.created_at));
      } else if (sort_by === "id") {
        // id가 string이므로 숫자 비교를 위해 파싱
        const aNum = parseInt(a.id.replace(/\D/g, ""), 10);
        const bNum = parseInt(b.id.replace(/\D/g, ""), 10);
        return order * (aNum - bNum);
      } else if (sort_by === "status") {
        return order * a.status.localeCompare(b.status);
      } else if (sort_by === "category") {
        return order * a.category.localeCompare(b.category);
      }
      return 0;
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      success: true,
      data: {
        total: filtered.length,
        page,
        limit,
        total_pages: Math.ceil(filtered.length / limit),
        inquiries: filtered.slice(start, end),
      },
    };
  },

  // 문의 상세 조회 mock
  getInquiryDetail: async (inquiryId) => {
    await new Promise((r) => setTimeout(r, 300));
    const inquiry = mockInquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      return {
        success: false,
        error: { message: "문의 내역을 찾을 수 없습니다." },
      };
    }
    return {
      success: true,
      data: inquiry,
    };
  },

  // 답변 등록 mock
  createInquiryReply: async (inquiryId, { admin_id, message }) => {
    await new Promise((r) => setTimeout(r, 300));
    const inquiry = mockInquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      return {
        success: false,
        error: { message: "문의 내역을 찾을 수 없습니다." },
      };
    }
    inquiry.answer = {
      message,
      admin_id,
      answered_at: new Date().toISOString(),
    };
    inquiry.status = "answered";
    return {
      success: true,
      data: inquiry,
    };
  },

  // 상태 변경 mock
  updateInquiryStatus: async (inquiryId, { status }) => {
    await new Promise((r) => setTimeout(r, 300));
    const inquiry = mockInquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      return {
        success: false,
        error: { message: "문의 내역을 찾을 수 없습니다." },
      };
    }
    inquiry.status = status;
    return {
      success: true,
      data: inquiry,
    };
  },
};

// 문의 mock 데이터 100개 생성
export const mockInquiries = Array.from({ length: 100 }, (_, i) => {
  const categories = ["account", "service", "bug", "payment", "etc"];
  const statusArr = ["pending", "answered"];
  const category = categories[i % categories.length];
  const status = statusArr[Math.floor(Math.random() * statusArr.length)];
  const createdAt = new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
  ) // 최근 60일 내
    .toISOString();
  const answer =
    status === "answered"
      ? {
          message: `${category} 문의에 대한 답변입니다.`,
          admin_id: `admin_${(i % 5) + 1}`,
          answered_at: new Date(
            new Date(createdAt).getTime() + 60 * 60 * 1000
          ).toISOString(),
        }
      : null;
  return {
    id: `inquiry_id_${(i + 1).toString().padStart(3, "0")}`,
    user_id: `user_${(i + 1).toString().padStart(3, "0")}`,
    uid: `uid_${(i + 1).toString().padStart(3, "0")}`,
    category,
    message: `${category} 관련 문의 내용입니다. (${i + 1})`,
    status,
    created_at: createdAt,
    answer,
  };
});

// Snap mock 데이터 30개 생성
export const mockSnaps = Array.from({ length: 30 }, (_, i) => {
  const statusArr = ["active", "pending", "hidden", "deleted"];
  const status = statusArr[Math.floor(Math.random() * statusArr.length)];
  const createdAt = new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  return {
    id: `snap_id_${(i + 1).toString().padStart(3, "0")}`,
    title: `스냅 제목 ${i + 1}`,
    user_id: `user_${(i + 1).toString().padStart(3, "0")}`,
    status,
    created_at: createdAt,
    image_url: `https://picsum.photos/seed/snap${i + 1}/300/200`,
    like_count: Math.floor(Math.random() * 100),
    view_count: Math.floor(Math.random() * 1000),
    captions: [
      `이것은 스냅 ${i + 1}의 첫 번째 캡션입니다.`,
      `이것은 스냅 ${i + 1}의 두 번째 캡션입니다.`,
    ],
    hash_tags: [`#태그${(i % 3) + 1}`, `#테스트${(i % 2) + 1}`],
    snap_images: [
      `https://picsum.photos/seed/snap${i + 1}-1/300/200`,
      `https://picsum.photos/seed/snap${i + 1}-2/300/200`,
    ],
    comment_count: Math.floor(Math.random() * 20),
  };
});

export const mockSnapAPI = {
  // 스냅 목록 조회
  getSnaps: async ({ page = 1, limit = 10 } = {}) => {
    await new Promise((r) => setTimeout(r, 300));
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      success: true,
      data: {
        snaps: mockSnaps.slice(start, end),
        total: mockSnaps.length,
        page,
        limit,
        total_pages: Math.ceil(mockSnaps.length / limit),
      },
    };
  },

  // 스냅 상세 조회
  getSnapDetail: async (snapId) => {
    await new Promise((r) => setTimeout(r, 300));
    const snap = mockSnaps.find((s) => s.id === snapId);
    if (!snap) {
      return {
        success: false,
        error: { message: "스냅을 찾을 수 없습니다." },
      };
    }
    return {
      success: true,
      data: snap,
    };
  },

  // 스냅 상태 변경
  updateSnapStatus: async (snapId, { status }) => {
    await new Promise((r) => setTimeout(r, 300));
    const snap = mockSnaps.find((s) => s.id === snapId);
    if (!snap) {
      return {
        success: false,
        error: { message: "스냅을 찾을 수 없습니다." },
      };
    }
    snap.status = status;
    return {
      success: true,
      data: snap,
    };
  },

  // 스냅 통계 대시보드 데이터
  getSnapStatistics: async () => {
    await new Promise((r) => setTimeout(r, 300));
    const activeSnaps = mockSnaps.filter((s) => s.status === "active").length;
    const hiddenSnaps = mockSnaps.filter((s) => s.status === "hidden").length;
    const deletedSnaps = mockSnaps.filter((s) => s.status === "deleted").length;
    return {
      success: true,
      data: {
        total: mockSnaps.length,
        active: activeSnaps,
        hidden: hiddenSnaps,
        deleted: deletedSnaps,
      },
    };
  },
};

// Mock Snap Reports 데이터
const mockSnapReports = Array.from({ length: 50 }, (_, index) => ({
  report_id: `SR${(index + 1).toString().padStart(5, "0")}`,
  type: "snap",
  snap_id: `SNAP${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  snap_title: `스냅 제목 ${index + 1}`,
  reporter_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reason: ["스팸", "불법컨텐츠", "욕설/비방", "사기", "기타"][
    Math.floor(Math.random() * 5)
  ],
  description: `스냅 신고 상세 내용 ${index + 1}`,
  status: ["pending", "resolved", "rejected"][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  severity: Math.floor(Math.random() * 5) + 1,
}));

// Mock Comment Reports 데이터
const mockCommentReports = Array.from({ length: 40 }, (_, index) => ({
  report_id: `CMR${(index + 1).toString().padStart(5, "0")}`,
  type: "comment",
  comment_id: `COMMENT${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  comment_content: `댓글 내용 ${index + 1}`,
  reporter_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  reported_user_id: `USER${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
  parent_comment_id:
    Math.random() > 0.5
      ? `COMMENT${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(5, "0")}`
      : null,
  reason: ["스팸", "불법컨텐츠", "욕설/비방", "사기", "기타"][
    Math.floor(Math.random() * 5)
  ],
  description: `댓글 신고 상세 내용 ${index + 1}`,
  status: ["pending", "resolved", "rejected"][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  severity: Math.floor(Math.random() * 5) + 1,
  post_id: `POST${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(5, "0")}`,
}));
