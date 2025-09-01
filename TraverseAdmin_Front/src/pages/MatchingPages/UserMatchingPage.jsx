import Header from "../../components/common/Header";
import MatchingSettings from "../../components/matching/MatchingSettings";

const MatchSettingsPage = () => {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="매칭 알고리즘 설정" />
      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <MatchingSettings />
      </main>
    </div>
  );
};

export default MatchSettingsPage;
