import React, { useState, useCallback } from "react";
import Header from "../../components/common/Header";

import NotificationModal from "../../components/notifications/NotificationModal";
import NotificationHistoryTable from "../../components/notifications/NotificationHistoryTable";
import NotificationDetailModal from "../../components/notifications/NotificationDetailModal.jsx";

const NotificationPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [refetchKey, setRefetchKey] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleOpenModal = () => {
    setEditTemplate(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTemplate(null);
  };

  const handleSuccess = useCallback((response) => {
    console.log("알림 발송 성공:", response);
    setRefetchKey((prev) => prev + 1);
    setModalOpen(false);
    setEditTemplate(null);
  }, []);

  return (
      <div className="overflow-auto relative z-10 flex-1">
        <Header title="알림 발송 및 내역 조회" />
        <main className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12 ">
          <div className="flex justify-end items-center mx-auto mb-6 max-w-5xl">
            <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleOpenModal}
            >
              알림 발송
            </button>
          </div>
          <div className="mx-auto max-w-5xl">
            <NotificationHistoryTable
                refetchKey={refetchKey}
                onSelectNotification={setSelectedNotification}
            />
          </div>
          <NotificationModal
              open={modalOpen}
              onClose={handleCloseModal}
              onSuccess={handleSuccess}
              template={editTemplate}
          />
          <NotificationDetailModal
              notification={selectedNotification}
              onClose={() => setSelectedNotification(null)}
          />
        </main>
      </div>
  );
};

export default NotificationPage;
