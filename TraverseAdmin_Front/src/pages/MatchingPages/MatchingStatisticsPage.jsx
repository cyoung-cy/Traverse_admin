import Header from "../../components/common/Header";
import MatchingStatistics from "../../components/matching/MatchingStatistics";

const MatchingStatisticsPage = () => {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="매칭 통계" />
      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <MatchingStatistics />
      </main>
    </div>
  );
};

export default MatchingStatisticsPage;
