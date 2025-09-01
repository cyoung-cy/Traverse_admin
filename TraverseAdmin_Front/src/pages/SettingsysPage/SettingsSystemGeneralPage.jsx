import React from "react";
import Header from "../../components/common/Header";
import SettingsSystemPanel from "../../components/settingsystem/SettingsSystemPanel";

export default function SettingsSystemGeneralPage() {
  return (
    <div className="overflow-auto relative z-10 flex-1">
      <Header title="시스템 설정 - 기본 정보" />
      <main className="px-2 py-4 mx-auto w-full lg:px-8">
        <SettingsSystemPanel />
      </main>
    </div>
  );
}
