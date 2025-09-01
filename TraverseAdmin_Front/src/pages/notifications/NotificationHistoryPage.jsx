import Header from "../../components/common/Header";
import NotificationHistoryTable from "../../components/notifications/NotificationHistoryTable";

const NotificationHistoryPage = () => {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="알림 발송 내역" />
      <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
        <NotificationHistoryTable />
      </main>
    </div>
  );
};

export default NotificationHistoryPage;
