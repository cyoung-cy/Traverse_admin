import Header from "../../components/common/Header";
import HashtagDetail from "../../components/hashtags/HashtagDetail";

const HashtagDetailPage = () => {
  return (
    <div className="w-full">
      <Header title="해시태그 상세 정보" />
      <div className="p-6">
        <HashtagDetail />
      </div>
    </div>
  );
};

export default HashtagDetailPage;
