import Header from "../../components/common/Header";
import UserWithdrawalTable from "../../components/users/UserWithdrawalTable";
import WithdrawalStatistics from "../../components/users/WithdrawalStatistics";

const UserWithdrawalPage = () => {
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="사용자 등록 검토 어쩌구 페이지" />
      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <WithdrawalStatistics />
        <UserWithdrawalTable />
      </main>
    </div>
  );
};

export default UserWithdrawalPage;
