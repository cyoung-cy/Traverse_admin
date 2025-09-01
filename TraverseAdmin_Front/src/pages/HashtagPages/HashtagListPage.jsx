import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import HashtagsTable from "../../components/hashtags/HashtagsTable";

const HashtagListPage = () => {
  return (
    <div className="w-full">
      <Header title="해시태그 관리" />
      <div className="p-6">
        <HashtagsTable />
      </div>
    </div>
  );
};

export default HashtagListPage;
