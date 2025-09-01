import Header from "../../components/common/Header";
import HashtagStatistics from "../../components/hashtags/HashtagStatistics";

const HashtagStatisticsPage = () => {
  return (
    <div className="w-full">
      <Header title="해시태그 통계" />
      <div className="p-6">
        <HashtagStatistics />
      </div>
    </div>
  );
};

export default HashtagStatisticsPage;
