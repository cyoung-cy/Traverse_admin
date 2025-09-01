import React from "react";
import InquiryDetail from "../../components/inquiries/InquiryDetail";
import { useParams, useNavigate } from "react-router-dom";

const InquiriesDetailPage = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <div className="flex justify-start mt-4 ml-4">
        <button
          type="button"
          onClick={() => navigate("/inquiry/list")}
          className="flex gap-2 items-center px-4 py-2 mb-6 font-semibold text-white bg-blue-600 rounded-lg shadow transition hover:bg-blue-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          목록으로
        </button>
      </div>
      <InquiryDetail inquiryId={inquiryId} />
    </div>
  );
};

export default InquiriesDetailPage;
