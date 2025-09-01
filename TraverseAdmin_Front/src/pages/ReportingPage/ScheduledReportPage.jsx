import React, { useEffect, useState } from "react";
import { reportsAnalyticsAPI } from "../../utils/api";
import { CalendarPlus, ListChecks } from "lucide-react";

const cardClass =
  "bg-white/10 rounded-xl shadow-md p-6 flex flex-col gap-3 min-w-[220px] max-w-xl mx-auto hover:shadow-lg transition border border-white/10";

const ScheduledReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metrics, setMetrics] = useState("");
  const [recipients, setRecipients] = useState("");
  const [format, setFormat] = useState("pdf");
  const [frequency, setFrequency] = useState("weekly");
  const [day, setDay] = useState(1); // 주간: 1(월)~7(일), 월간: 1~31
  const [time, setTime] = useState("09:00");
  const [timezone, setTimezone] = useState("Asia/Seoul");
  const [createMsg, setCreateMsg] = useState(null);

  useEffect(() => {
    reportsAnalyticsAPI
      .getScheduledReports()
      .then((res) => setReports(res.data.reports))
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [createMsg]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateMsg(null);
    // 입력값 가공
    const metricsArr = metrics
      .split(/,|\n/)
      .map((m) => m.trim())
      .filter((m) => m);
    const recipientsArr = recipients
      .split(/,|\n/)
      .map((r) => r.trim())
      .filter((r) => r);
    const schedule = {
      frequency,
      ...(frequency !== "daily" && { day: Number(day) }),
      time,
      timezone,
    };
    try {
      await reportsAnalyticsAPI.createScheduledReport({
        name,
        description,
        metrics: metricsArr,
        filters: { other_filters: {} }, // UI 확장 전까지 빈 객체
        schedule,
        recipients: recipientsArr,
        format,
      });
      setCreateMsg("정기 보고서가 생성되었습니다.");
      setName("");
      setDescription("");
      setMetrics("");
      setRecipients("");
      setFormat("pdf");
      setFrequency("weekly");
      setDay(1);
      setTime("09:00");
      setTimezone("Asia/Seoul");
    } catch {
      setCreateMsg("생성 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-center">정기 보고서 설정</h1>
      <div className="mb-8">
        <div className={cardClass}>
          <div className="flex gap-2 items-center mb-2 text-lg font-semibold">
            <CalendarPlus className="text-blue-400" size={22} /> 정기 보고서
            생성
          </div>
          <form className="flex flex-col gap-2 mb-2" onSubmit={handleCreate}>
            <input
              className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="보고서 이름"
              required
            />
            <textarea
              className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="보고서 설명"
              rows={2}
            />
            <input
              className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="메트릭(예: signup, retention, engagement) - 콤마 또는 줄바꿈 구분"
              required
            />
            <input
              className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="수신자 이메일(콤마 또는 줄바꿈 구분)"
              required
            />
            <div className="flex flex-wrap gap-2">
              <select
                className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
              <select
                className="px-2 py-1 text-white bg-gray-900 rounded border border-gray-700"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
              </select>
              {frequency !== "daily" && (
                <div className="flex gap-1 items-center">
                  <input
                    className="px-2 py-1 w-24 text-white bg-gray-900 rounded border border-gray-700"
                    type="number"
                    min={1}
                    max={frequency === "weekly" ? 7 : 31}
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder={
                      frequency === "weekly" ? "요일(1~7)" : "날짜(1~31)"
                    }
                    required
                  />
                  <span className="text-xs text-gray-400">
                    {frequency === "weekly"
                      ? "(1=월, 2=화, 3=수, 4=목, 5=금, 6=토, 7=일)"
                      : "(1~31=해당 일)"}
                  </span>
                </div>
              )}
              <input
                className="px-2 py-1 w-36 text-white bg-gray-900 rounded border border-gray-700"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <input
                className="px-2 py-1 w-40 text-white bg-gray-900 rounded border border-gray-700"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="타임존(예: Asia/Seoul)"
                required
              />
            </div>
            <button
              className="px-4 py-1 font-semibold text-white bg-blue-500 rounded transition hover:bg-blue-600"
              type="submit"
            >
              생성
            </button>
          </form>
          {createMsg && <div className="mb-2 text-green-600">{createMsg}</div>}
        </div>
      </div>
      <div className={cardClass + " mt-4"}>
        <div className="flex gap-2 items-center mb-2 text-lg font-semibold">
          <ListChecks className="text-yellow-400" size={22} /> 정기 보고서 목록
        </div>
        <ul className="divide-y divide-gray-700">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 py-3">
              <div className="font-bold text-blue-200">{r.name}</div>
              <div className="text-sm text-gray-300">{r.description}</div>
              <div className="text-xs text-gray-400">주기: {r.frequency}</div>
              <div className="text-xs text-gray-400">
                다음 실행: {new Date(r.next_run_at).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                생성자: {r.created_by}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduledReportPage;
