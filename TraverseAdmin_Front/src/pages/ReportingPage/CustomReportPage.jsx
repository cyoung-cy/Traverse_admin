import React, { useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import { FilePlus2, Download } from "lucide-react";

const cardClass =
  "bg-white/10 rounded-xl shadow-md p-6 flex flex-col gap-3 min-w-[320px]  mx-auto hover:shadow-lg transition border border-white/10";

const formatOptions = [
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
  { value: "pdf", label: "PDF" },
];

const metricOptions = [
  { value: "signup", label: "가입자 수" },
  { value: "retention", label: "리텐션" },
  { value: "engagement", label: "참여도" },
  { value: "dau", label: "DAU" },
  { value: "wau", label: "WAU" },
  { value: "mau", label: "MAU" },
];

const groupByOptions = [
  { value: "date", label: "날짜" },
  { value: "gender", label: "성별" },
  { value: "country", label: "국가" },
  { value: "age", label: "연령대" },
];

const countryOptions = [
  { value: "", label: "선택 안함" },
  { value: "KR", label: "대한민국" },
  { value: "US", label: "미국" },
  { value: "JP", label: "일본" },
  { value: "CN", label: "중국" },
];

const genderOptions = [
  { value: "", label: "선택 안함" },
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
];

const CustomReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // 입력값 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metrics, setMetrics] = useState([]); // 배열로 변경
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [format, setFormat] = useState("json");
  // 기타 필터
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [extraFilters, setExtraFilters] = useState([{ key: "", value: "" }]);

  // metrics 체크박스 핸들러
  const handleMetricChange = (value) => {
    setMetrics((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };

  // 추가 필터 핸들러
  const handleExtraFilterChange = (idx, field, val) => {
    setExtraFilters((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };
  const addExtraFilter = () => {
    setExtraFilters((prev) => [...prev, { key: "", value: "" }]);
  };
  const removeExtraFilter = (idx) => {
    setExtraFilters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setValidationError("");
    setError(null);
    setResult(null);
    // 날짜 유효성 검사
    if (startDate && endDate && startDate > endDate) {
      setValidationError("시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }
    // metrics 선택 검사
    if (!metrics || metrics.length === 0) {
      setValidationError("메트릭을 하나 이상 선택해 주세요.");
      return;
    }
    setLoading(true);
    try {
      // 기타 필터 조합
      let otherFiltersObj = {};
      if (country) otherFiltersObj.country = country;
      if (gender) otherFiltersObj.gender = gender;
      extraFilters.forEach(({ key, value }) => {
        if (key && value) otherFiltersObj[key] = value;
      });
      const payload = {
        name,
        description,
        metrics,
        filters: {
          start_date: startDate,
          end_date: endDate,
          other_filters: otherFiltersObj,
        },
        group_by: groupBy,
        format,
      };
      const res = await reportsAnalyticsAPI.createCustomReport(payload);
      setResult(res.data);
    } catch (e) {
      setError("보고서 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 다운로드 버튼 클릭 시 상태 피드백
  const handleDownload = async (e) => {
    setDownloading(true);
    // a 태그 기본 동작(다운로드) 후 1초 후 상태 복구
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="p-6 mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-center">
        커스텀 보고서 생성
      </h1>
      <form className={cardClass} onSubmit={handleCreate}>
        <div className="flex gap-2 items-center mb-2 text-lg font-semibold">
          <FilePlus2 className="text-blue-400" size={22} /> 커스텀 보고서 생성
        </div>
        <label className="flex flex-col gap-1">
          <span>보고서 이름</span>
          <input
            className="text-black input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>설명</span>
          <input
            className="text-black input input-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="flex flex-col gap-1">
          <span>메트릭(복수 선택 가능)</span>
          <div className="flex flex-wrap gap-2">
            {metricOptions.map((opt) => (
              <label key={opt.value} className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={metrics.includes(opt.value)}
                  onChange={() => handleMetricChange(opt.value)}
                />
                <span className="text-sm text-black">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <label className="flex flex-col flex-1 gap-1">
            <span>시작일</span>
            <input
              type="date"
              className="text-black input input-bordered"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col flex-1 gap-1">
            <span>종료일</span>
            <input
              type="date"
              className="text-black input input-bordered"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <span>기타 필터</span>
          <div className="flex gap-2">
            <select
              className="text-black input input-bordered"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              className="text-black input input-bordered"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            {extraFilters.map((f, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="flex-1 text-black input input-bordered"
                  placeholder="key"
                  value={f.key}
                  onChange={(e) =>
                    handleExtraFilterChange(idx, "key", e.target.value)
                  }
                />
                <input
                  className="flex-1 text-black input input-bordered"
                  placeholder="value"
                  value={f.value}
                  onChange={(e) =>
                    handleExtraFilterChange(idx, "value", e.target.value)
                  }
                />
                {extraFilters.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeExtraFilter(idx)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-1 text-sm text-blue-500"
              onClick={addExtraFilter}
            >
              + 추가 필터
            </button>
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <span>그룹핑 기준</span>
          <select
            className="text-black input input-bordered"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="">선택</option>
            {groupByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>포맷</span>
          <select
            className="text-black input input-bordered"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            {formatOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="px-4 py-2 mt-2 font-semibold text-white bg-blue-500 rounded transition hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "생성 중..." : "보고서 생성"}
        </button>
        {validationError && (
          <div className="mt-2 text-red-500">{validationError}</div>
        )}
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {result && (
          <div className="flex flex-col gap-2 items-start mt-4">
            <div className="flex gap-2 items-center font-semibold text-green-400">
              <Download size={18} /> 보고서가 생성되었습니다.
            </div>
            <a
              href={result.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 items-center font-semibold text-blue-600 underline"
              onClick={handleDownload}
            >
              <Download size={16} />
              {downloading ? "다운로드 중..." : "보고서 다운로드"}
            </a>
            <div className="text-xs text-gray-300">
              만료일: {new Date(result.expires_at).toLocaleString()}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomReportPage;
