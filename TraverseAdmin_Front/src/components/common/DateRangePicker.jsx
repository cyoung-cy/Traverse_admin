import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [start, setStart] = useState(() => format(startDate, "yyyy-MM-dd"));
  const [end, setEnd] = useState(() => format(endDate, "yyyy-MM-dd"));

  useEffect(() => {
    setStart(format(startDate, "yyyy-MM-dd"));
    setEnd(format(endDate, "yyyy-MM-dd"));
  }, [startDate, endDate]);

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);

    if (new Date(newStart) <= new Date(end)) {
      onChange(new Date(newStart), new Date(end));
    }
  };

  const handleEndChange = (e) => {
    const newEnd = e.target.value;
    setEnd(newEnd);

    if (new Date(start) <= new Date(newEnd)) {
      onChange(new Date(start), new Date(newEnd));
    }
  };

  // 빠른 날짜 범위 선택 옵션
  const handleQuickSelect = (days) => {
    const newEnd = new Date();
    const newStart = new Date();
    newStart.setDate(newStart.getDate() - days);

    setStart(format(newStart, "yyyy-MM-dd"));
    setEnd(format(newEnd, "yyyy-MM-dd"));
    onChange(newStart, newEnd);
  };

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex items-center space-x-2">
        <input
          type="date"
          className="px-3 py-2 text-sm bg-gray-700 rounded-md border border-gray-600"
          value={start}
          onChange={handleStartChange}
        />
        <span>~</span>
        <input
          type="date"
          className="px-3 py-2 text-sm bg-gray-700 rounded-md border border-gray-600"
          value={end}
          onChange={handleEndChange}
        />
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => handleQuickSelect(7)}
          className="px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600 hover:bg-gray-600"
        >
          7일
        </button>
        <button
          onClick={() => handleQuickSelect(30)}
          className="px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600 hover:bg-gray-600"
        >
          30일
        </button>
        <button
          onClick={() => handleQuickSelect(90)}
          className="px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600 hover:bg-gray-600"
        >
          90일
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
