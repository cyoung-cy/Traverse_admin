import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Hash, AlertCircle, RotateCw } from "lucide-react";
import { hashtagAPI } from "../../utils/api";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { useNavigate } from "react-router-dom";

const HashtagWordcloud = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const [period, setPeriod] = useState("month");
  const [limit, setLimit] = useState(100);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchWordcloudData();
  }, [period, limit]);

  useEffect(() => {
    if (hashtags.length > 0 && !loading) {
      renderWordcloud();
    }
  }, [hashtags, loading]);

  // 브라우저 크기 변경 시 워드 클라우드 다시 그리기
  useEffect(() => {
    const handleResize = () => {
      if (hashtags.length > 0 && !loading) {
        renderWordcloud();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hashtags, loading]);

  const fetchWordcloudData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hashtagAPI.getWordcloud({
        limit,
        period,
      });
      console.log("response", response);

      if (response.data?.hashtags) {
        console.log("response2", response);
        setHashtags(response.data.hashtags);
      } else {
        throw new Error(
          response.error?.message ||
            "워드 클라우드 데이터를 가져오는데 실패했습니다"
        );
      }
    } catch (error) {
      console.error("워드 클라우드 데이터 조회 중 오류:", error);
      setError(error.message || "데이터를 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const renderWordcloud = () => {
    if (!svgRef.current || !containerRef.current || hashtags.length === 0)
      return;

    // SVG 엘리먼트 초기화
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 컨테이너 크기 계산
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = 500; // 고정 높이

    // SVG 크기 설정
    svg.attr("width", containerWidth).attr("height", containerHeight);

    // 워드 클라우드 레이아웃 생성
    const layout = cloud()
      .size([containerWidth, containerHeight])
      .words(
        // 기존 큰 값 비례 방식
        // hashtags.map((hashtag) => ({
        //   text: hashtag.name,
        //   size: Math.max(14, Math.min(60, hashtag.weight)), // 최소 14px, 최대 60px
        //   weight: hashtag.weight,
        //   id: hashtag.id,
        // }))

        // 발표용 시각 극단적 구조
        hashtags.map((hashtag) => {
          // 정규화 + 제곱(power=2) 변환으로 중간값 차이 극대화
          const minFontSize = 14;
          const maxFontSize = 60;
          const value =
            hashtag.weight !== undefined ? hashtag.weight : hashtag.usage_count;
          const allValues = hashtags.map((h) =>
            h.weight !== undefined ? h.weight : h.usage_count
          );
          const minValue = Math.min(...allValues);
          const maxValue = Math.max(...allValues);

          const normalized = (value - minValue) / (maxValue - minValue);
          const power = 2; // 숫자가 커질수록 중간값 차이 극대화
          const powered = Math.pow(normalized, power);
          const normalizedSize =
            maxValue === minValue
              ? (minFontSize + maxFontSize) / 2
              : minFontSize + powered * (maxFontSize - minFontSize);

          return {
            text: hashtag.name,
            size: normalizedSize,
            weight: value,
            id: hashtag.id,
          };
        })
      )
      .padding(5)
      .rotate(() => 0) // 회전 없음
      .fontSize((d) => d.size)
      .on("end", draw);

    layout.start();

    // 워드 클라우드 그리기
    function draw(words) {
      // 색상 배열
      const colors = [
        "#3B82F6", // 파란색
        "#10B981", // 초록색
        "#F59E0B", // 주황색
        "#8B5CF6", // 보라색
        "#EC4899", // 분홍색
      ];

      // 중앙 위치 계산
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;

      svg
        .append("g")
        .attr("transform", `translate(${centerX},${centerY})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Inter, sans-serif")
        .style("font-weight", (d) => (d.size > 30 ? "bold" : "normal"))
        .style("fill", (d, i) => colors[i % colors.length])
        .style("cursor", "pointer")
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .text((d) => d.text)
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("opacity", 1)
        .on("end", function () {
          d3.select(this)
            .on("click", (event, d) => {
              navigate(`/hashtags/${d.id}`);
            })
            .on("mouseover", function () {
              d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", 0.7)
                .attr("transform", function (d) {
                  return `translate(${d.x},${d.y}) scale(1.1)`;
                });
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", 1)
                .attr("transform", function (d) {
                  return `translate(${d.x},${d.y}) scale(1)`;
                });
            });
        });
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 필터 및 컨트롤 */}
      <motion.div
        className="flex flex-wrap gap-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg"
        variants={item}
        whileHover={{ boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }}
      >
        <div className="flex items-center">
          <Calendar size={18} className="mr-2 text-gray-400" />
          <span className="text-gray-300">기간:</span>
        </div>
        <div>
          <motion.select
            value={period}
            onChange={handlePeriodChange}
            className="p-2 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileTap={{ scale: 0.95 }}
          >
            <option value="day">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
            <option value="year">올해</option>
          </motion.select>
        </div>

        <div className="flex items-center ml-4">
          <Hash size={18} className="mr-2 text-gray-400" />
          <span className="text-gray-300">표시 개수:</span>
        </div>
        <div>
          <motion.select
            value={limit}
            onChange={handleLimitChange}
            className="p-2 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileTap={{ scale: 0.95 }}
          >
            <option value="50">50개</option>
            <option value="100">100개</option>
            <option value="150">150개</option>
            <option value="200">200개</option>
          </motion.select>
        </div>

        <motion.button
          onClick={fetchWordcloudData}
          className="flex items-center px-4 py-2 ml-auto text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCw size={16} className="mr-2" />
          새로고침
        </motion.button>
      </motion.div>

      {/* 에러 표시 */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-6 text-white bg-red-900 bg-opacity-30 rounded-lg border border-red-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            variants={item}
          >
            <div className="flex items-start">
              <AlertCircle
                className="flex-shrink-0 mt-1 mr-2 text-red-500"
                size={20}
              />
              <div>
                <h3 className="mb-2 font-semibold">오류 발생</h3>
                <p>{error}</p>
                <motion.button
                  onClick={fetchWordcloudData}
                  className="px-4 py-2 mt-4 bg-red-700 rounded-lg transition-colors hover:bg-red-600"
                  whileHover={{ scale: 1.05, backgroundColor: "#B91C1C" }}
                  whileTap={{ scale: 0.95 }}
                >
                  다시 시도
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로딩 표시 */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className="flex justify-center items-center p-8"
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full border-4 border-t-blue-500 border-b-blue-700"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </motion.div>
        ) : hashtags.length === 0 && !error ? (
          <motion.div
            className="p-6 text-center text-gray-400"
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            variants={item}
          >
            표시할 해시태그가 없습니다
          </motion.div>
        ) : (
          <motion.div
            ref={containerRef}
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg h-[500px] overflow-hidden"
            key="wordcloud"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
            variants={item}
          >
            <svg ref={svgRef} className="w-full h-full"></svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 설명 */}
      <AnimatePresence>
        {!loading && hashtags.length > 0 && (
          <motion.div
            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            variants={item}
          >
            <h3 className="mb-2 text-sm font-medium text-gray-300">
              워드 클라우드 정보
            </h3>
            <p className="text-sm text-gray-400">
              • 글자 크기는 해시태그의 사용 빈도를 나타냅니다
              <br />
              • 해시태그를 클릭하면 상세 정보 페이지로 이동합니다
              <br />• 표시되는 해시태그는 선택한 기간 동안 가장 많이 사용된
              태그입니다
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HashtagWordcloud;
