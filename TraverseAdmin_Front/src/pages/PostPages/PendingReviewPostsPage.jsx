import PendingReviewPostsTable from "../../components/posts/PendingReviewPostsTable";
import Header from "../../components/common/Header";

const PendingReviewPostsPage = () => (
  <div className="overflow-auto relative z-10 flex-1">
    <Header title="게시물 검토 대기 목록" />
    <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
      <PendingReviewPostsTable />
    </main>
  </div>
);

export default PendingReviewPostsPage;
