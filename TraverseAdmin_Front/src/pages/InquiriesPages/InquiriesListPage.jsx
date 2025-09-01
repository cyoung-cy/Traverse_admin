import React from "react";
import Header from "../../components/common/Header";
import InquiriesTable from "../../components/inquiries/InquiriesTable";
import { useNavigate } from "react-router-dom";

const InquiriesListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="문의 목록" />
      <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
        <InquiriesTable onRowClick={(row) => navigate(`/inquiry/${row.id}`)} />
      </main>
    </div>
  );
};

export default InquiriesListPage;
