import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Hash, AlertCircle } from "lucide-react";
import { hashtagAPI } from "../../utils/api";

const HashtagStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30일 전
    end_date: new Date().toISOString().split("T")[0], // 오늘
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!dateRange.start_date || !dateRange.end_date) {
        throw new Error("시작일과 종료일을 모두 선택해주세요");
      }

      if (new Date(dateRange.start_date) > new Date(dateRange.end_date)) {
        throw new Error("시작일은 종료일보다 이전이어야 합니다");
      }

      const response = await hashtagAPI.getHashtagStatistics(dateRange);

      console.log("hashtags response", response)
      if (response.data.success) {
        // 필수 필드 검증
        const requiredFields = [
          "total_hashtags",
          "new_hashtags",
          "trending_hashtags",
          "hashtag_trend",
        ];
        const missingFields = requiredFields.filter(
          (field) => !response.data.hasOwnProperty(field)
        );

        if (missingFields.length > 0) {
          throw new Error(
            `응답 데이터에 필수 필드가 누락되었습니다: ${missingFields.join(
              ", "
            )}`
          );
        }

        setStatistics(response.data);
        console.log("해시태그 통계:", response.data);
      } else {
        throw new Error(response.error?.message || "통계 데이터 가져오기 실패");
      }
    } catch (error) {
      console.error("통계 데이터 조회 중 오류 발생:", error);
      setError(
        error.message || "통계 데이터를 불러오는 중 오류가 발생했습니다"
      );
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-10 h-10 rounded-full border-4 animate-spin border-t-blue-500 border-b-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
        <div className="flex items-start">
          <AlertCircle
            className="flex-shrink-0 mt-1 mr-2 text-red-500"
            size={20}
          />
          <div>
            <h3 className="mb-2 font-semibold">오류 발생</h3>
            <p>{error}</p>
            <button
              onClick={fetchStatistics}
              className="px-4 py-2 mt-4 bg-red-700 rounded-lg transition-colors hover:bg-red-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-6 text-white">통계 데이터를 불러올 수 없습니다</div>
    );
  }

  // 안전하게 값 가져오기
  const safeTotal =
    typeof statistics.total_hashtags === "number"
      ? statistics.total_hashtags
      : 0;
  const safeNew =
    typeof statistics.new_hashtags === "number" ? statistics.new_hashtags : 0;
  const safeTrending = Array.isArray(statistics.trending_hashtags)
    ? statistics.trending_hashtags
    : [];
  const safeTrend = Array.isArray(statistics.hashtag_trend)
    ? statistics.hashtag_trend
    : [];

  return (
    <div className="space-y-6">
      {/* 날짜 필터 */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg">
        <div className="flex items-center">
          <Calendar size={18} className="mr-2 text-gray-400" />
          <span className="text-gray-300">기간 선택:</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            name="start_date"
            value={dateRange.start_date}
            onChange={handleDateChange}
            className="p-2 text-white bg-gray-700 rounded-lg border border-gray-600"
          />
          <span className="self-center text-gray-300">~</span>
          <input
            type="date"
            name="end_date"
            value={dateRange.end_date}
            onChange={handleDateChange}
            className="p-2 text-white bg-gray-700 rounded-lg border border-gray-600"
          />
        </div>
      </div>

      {/* 요약 정보 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="총 해시태그"
          value={safeTotal}
          icon={<Hash size={18} className="text-blue-400" />}
        />
        <SummaryCard
          title="새로운 해시태그"
          value={safeNew}
          icon={<Hash size={18} className="text-green-400" />}
        />
        <SummaryCard
            title="인기 해시태그"
            value={
              safeTrending[0]?.name
                  ? `${safeTrending[0].name} (${safeTrending[0].usage_count?.toLocaleString()}회)`
                  : "데이터 없음"
            }
            icon={<TrendingUp size={18} className="text-red-400" />}
        />


        <SummaryCard
          title="최근 30일 데이터"
          value={safeTrend.length}
          icon={<Calendar size={18} className="text-yellow-400" />}
        />
      </div>

      {/* 인기 해시태그 */}
      <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg">
        <h3 className="mb-4 font-semibold text-white">인기 상승 해시태그</h3>
        {safeTrending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-gray-200 border-collapse">
              <thead>
                <tr className="bg-gray-700 bg-opacity-60">
                  <th className="px-4 py-3 text-left border-b border-gray-600">
                    해시태그
                  </th>
                  <th className="px-4 py-3 text-left border-b border-gray-600">
                    사용 횟수
                  </th>
                  <th className="px-4 py-3 text-left border-b border-gray-600">
                    성장률
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeTrending.map((hashtag) => (
                  <tr
                    key={hashtag.id || index}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 font-medium">
                      #{hashtag.name || "이름 없음"}
                    </td>
                    <td className="px-4 py-3">
                      {typeof hashtag.usage_count === "number"
                        ? hashtag.usage_count.toLocaleString()
                        : 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <TrendingUp size={16} className="mr-2 text-green-500" />
                        <span>
                          {typeof hashtag.growth_rate === "number"
                            ? (hashtag.growth_rate * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">인기 상승 중인 해시태그가 없습니다</p>
        )}
      </div>

      {/* 트렌드 차트 (실제로는 여기에 차트 컴포넌트가 들어갈 수 있음) */}
      <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg">
        <h3 className="mb-4 font-semibold text-white">해시태그 추이</h3>
        {safeTrend.length > 0 ? (
          <div className="p-4 h-80 bg-gray-700 bg-opacity-50 rounded">
            {/* 실제 차트 대신 표시할 임시 내용 */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-400">일별 해시태그 사용 추이</p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="mr-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">총 사용량</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">신규 해시태그</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end space-x-1 w-full h-64">
                {safeTrend.slice(-14).map((data, index) => {
                  // 데이터 유효성 검사
                  const date = data.date ? new Date(data.date) : new Date();
                  const isValidDate = !isNaN(date.getTime());
                  const count = typeof data.count === "number" ? data.count : 0;
                  const newCount =
                    typeof data.new_count === "number" ? data.new_count : 0;

                  // 최대값 안전하게 계산
                  const maxCount = Math.max(
                    1,
                    ...safeTrend.map((d) =>
                      typeof d.count === "number" ? d.count : 0
                    )
                  );

                  return (
                    <div
                      key={index}
                      className="flex flex-col flex-1 items-center"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div
                          className="w-full bg-blue-500"
                          style={{
                            height: `${Math.min(
                              100,
                              (count / maxCount) * 100
                            )}%`,
                            minHeight: "5%",
                          }}
                        ></div>
                        <div
                          className="bg-green-500 w-full mt-0.5"
                          style={{
                            height: `${Math.min(
                              30,
                              (newCount / maxCount) * 100
                            )}%`,
                            minHeight: "3%",
                          }}
                        ></div>
                      </div>
                      <span className="mt-1 text-xs text-gray-400">
                        {isValidDate ? date.getDate() : "-"}일
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">해시태그 추이 데이터가 없습니다</p>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
    <motion.div
        className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 text-sm font-medium text-gray-400">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </motion.div>
);


export default HashtagStatistics;
