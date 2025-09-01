import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  return (
    <SettingSection icon={Bell} title={"알림"}>
      <ToggleSwitch
        label={"푸시 알림"}
        isOn={notifications.push}
        onToggle={() =>
          setNotifications({ ...notifications, push: !notifications.push })
        }
      />
      <ToggleSwitch
        label={"이메일 알림"}
        isOn={notifications.email}
        onToggle={() =>
          setNotifications({ ...notifications, email: !notifications.email })
        }
      />
      <ToggleSwitch
        label={"SMS 알림"}
        isOn={notifications.sms}
        onToggle={() =>
          setNotifications({ ...notifications, sms: !notifications.sms })
        }
      />
    </SettingSection>
  );
};
export default Notifications;
