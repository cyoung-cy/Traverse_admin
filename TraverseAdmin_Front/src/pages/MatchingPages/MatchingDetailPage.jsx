import Header from "../../components/common/Header";
import MatchDetail from "../../components/matching/MatchDetail";

const MatchingDetailPage = () => {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="매칭 상세" />
      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <MatchDetail />
      </main>
    </div>
  );
};

export default MatchingDetailPage;
