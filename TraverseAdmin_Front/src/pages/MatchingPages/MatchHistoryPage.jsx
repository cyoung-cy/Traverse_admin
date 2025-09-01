import Header from "../../components/common/Header";
import MatchingHistory from "../../components/matching/MatchingHistory";

const MatchHistoryPage = () => {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="매칭 히스토리" />
      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <MatchingHistory />
      </main>
    </div>
  );
};

export default MatchHistoryPage;
