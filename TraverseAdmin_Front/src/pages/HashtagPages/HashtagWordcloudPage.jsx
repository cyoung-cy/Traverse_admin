import Header from "../../components/common/Header";
import HashtagWordcloud from "../../components/hashtags/HashtagWordcloud";

const HashtagWordcloudPage = () => {
  return (
    <div className="w-full">
      <Header title="해시태그 워드 클라우드" />
      <div className="p-6">
        <HashtagWordcloud />
      </div>
    </div>
  );
};

export default HashtagWordcloudPage;
