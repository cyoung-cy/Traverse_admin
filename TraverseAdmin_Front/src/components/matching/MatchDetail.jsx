import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { matchingAPI } from "../../utils/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

const MatchDetail = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetail, setMatchDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 매칭 상세 정보 불러오기
  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        setLoading(true);
        const response = await matchingAPI.getMatchDetail(matchId);
        console.log("[매칭 상세 API 응답]", response);
        if (response.success) {
          setMatchDetail(response.data);
        } else {
          setError(
            response.error || { message: "매칭 정보를 찾을 수 없습니다" }
          );
        }
      } catch (error) {
        console.error(
          "매칭 상세 정보를 불러오는 중 오류가 발생했습니다:",
          error
        );
        setError({ message: "매칭 상세 정보를 불러올 수 없습니다" });
        toast.error("매칭 상세 정보를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetail();
  }, [matchId]);

  // 레이더 차트 데이터 생성
  const getFactorScoresChartData = () => {
    if (!matchDetail || !matchDetail.factor_scores) return null;

    return [
      {
        subject: "위치",
        score: matchDetail.factor_scores.location,
        fullMark: 100,
      },
      {
        subject: "관심사",
        score: matchDetail.factor_scores.interests,
        fullMark: 100,
      },
      {
        subject: "연령",
        score: matchDetail.factor_scores.age,
        fullMark: 100,
      },
      {
        subject: "성별",
        score: matchDetail.factor_scores.gender,
        fullMark: 100,
      },
      {
        subject: "활동 수준",
        score: matchDetail.factor_scores.activity_level,
        fullMark: 100,
      },
    ];
  };

  // 매칭 상태에 따른 배지 스타일
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // 매칭 상태 한글화
  const getStatusText = (status) => {
    switch (status) {
      case "successful":
        return "성공";
      case "active":
        return "진행 중";
      case "failed":
        return "실패";
      default:
        return status;
    }
  };

  // 공통 사용자 정보 카드 컴포넌트
  const UserCard = ({ user, title }) => {
    if (!user) return null;

    return (
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="mb-3 font-medium text-md">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-400">이름</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">ID</p>
            <p className="font-medium">{user.user_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">나이</p>
            <p>{user.age}세</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">성별</p>
            <p>{user.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">위치</p>
            <p>{user.location}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-400">관심사</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs text-gray-200 bg-gray-600 rounded"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-2 mt-2">
            <Link
              to={`/users/${user.user_id}`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              사용자 상세 정보 보기
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="overflow-auto relative z-10 flex-1 px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
          <div className="flex justify-center items-center h-40">
            <div className="text-xl text-gray-400">
              매칭 정보를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="overflow-auto relative z-10 flex-1 px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
          <div className="flex flex-col justify-center items-center h-40">
            <div className="mb-4 text-xl text-red-400">{error.message}</div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-700"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!matchDetail) return null;

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">매칭 상세 정보</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm bg-gray-600 rounded-md hover:bg-gray-700"
        >
          뒤로 가기
        </button>
      </div>

      {/* 매칭 기본 정보 */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-gray-700 rounded-lg">
          <h3 className="mb-2 text-sm text-gray-400">매칭 ID</h3>
          <p className="text-lg font-bold">{matchDetail.match_id}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <h3 className="mb-2 text-sm text-gray-400">생성일</h3>
          <p className="text-lg font-bold">
            {format(new Date(matchDetail.created_at), "yyyy.MM.dd HH:mm", {
              locale: ko,
            })}
          </p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <h3 className="mb-2 text-sm text-gray-400">매칭 점수</h3>
          <p className="text-lg font-bold">{matchDetail.score.toFixed(1)}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <h3 className="mb-2 text-sm text-gray-400">상태</h3>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
              matchDetail.status
            )}`}
          >
            {getStatusText(matchDetail.status)}
          </span>
        </div>
      </div>

      {/* 사용자 정보 비교 */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <UserCard user={matchDetail.user1} title="사용자 1" />
        <UserCard user={matchDetail.user2} title="사용자 2" />
      </div>

      {/* 매칭 요소 점수 */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="p-4 h-full bg-gray-700 rounded-lg">
            <h3 className="mb-4 font-medium text-md">매칭 요소별 점수</h3>
            <div className="space-y-3">
              {Object.entries(matchDetail.factor_scores).map(
                ([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">
                        {factor === "location"
                          ? "위치"
                          : factor === "interests"
                          ? "관심사"
                          : factor === "age"
                          ? "연령"
                          : factor === "gender"
                          ? "성별"
                          : factor === "activity_level"
                          ? "활동 수준"
                          : factor}
                      </span>
                      <span className="text-sm">{score.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="p-4 h-full bg-gray-700 rounded-lg">
            <h3 className="mb-3 font-medium text-md">매칭 요소 레이더 차트</h3>
            <div className="h-60 md:h-80">
              {getFactorScoresChartData() && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={getFactorScoresChartData()}
                  >
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      stroke="rgba(255, 255, 255, 0.7)"
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="rgba(255, 255, 255, 0.7)"
                    />
                    <Radar
                      name="매칭 요소별 점수"
                      dataKey="score"
                      stroke="rgba(75, 192, 192, 1)"
                      fill="rgba(75, 192, 192, 0.2)"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        borderColor: "#4B5563",
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 관련 정보 */}
      {matchDetail.status !== "failed" && (
        <div className="p-4 mb-6 bg-gray-700 rounded-lg">
          <h3 className="mb-3 font-medium text-md">채팅 정보</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="mb-1 text-sm text-gray-400">채팅방 ID</p>
              <p className="font-medium">
                {matchDetail.chat_room_id ? (
                  <Link
                    to={`/chats/rooms/${matchDetail.chat_room_id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {matchDetail.chat_room_id}
                  </Link>
                ) : (
                  "채팅방이 생성되지 않았습니다"
                )}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-400">메시지 수</p>
              <p className="font-medium">{matchDetail.message_count}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-400">대화 지속 시간</p>
              <p className="font-medium">
                {matchDetail.match_duration > 0
                  ? `${Math.floor(matchDetail.match_duration / 60)}시간 ${
                      matchDetail.match_duration % 60
                    }분`
                  : "대화가 시작되지 않았습니다"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;
