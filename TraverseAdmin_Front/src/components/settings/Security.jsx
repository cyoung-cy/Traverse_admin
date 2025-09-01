import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <SettingSection icon={Lock} title={"보안"}>
      <ToggleSwitch
        label={"2차 인증"}
        isOn={twoFactor}
        onToggle={() => setTwoFactor(!twoFactor)}
      />
      <div className="mt-4">
        <button className="px-4 py-2 font-bold text-white bg-indigo-600 rounded transition duration-200 hover:bg-indigo-700">
          비밀번호 변경
        </button>
      </div>
    </SettingSection>
  );
};
export default Security;
