import { useState } from "react";
import SettingSection from "./SettingSection";
import { HelpCircle, Plus } from "lucide-react";

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "/google.png",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "/facebook.svg",
    },
    {
      id: 3,
      name: "Twitter",
      connected: true,
      icon: "/x.png",
    },
  ]);
  return (
    <SettingSection icon={HelpCircle} title={"연동 계정"}>
      {connectedAccounts.map((account) => (
        <div
          key={account.id}
          className="flex justify-between items-center py-3"
        >
          <div className="flex gap-1">
            <img
              src={account.icon}
              alt="Social img"
              className="object-cover mr-2 rounded-full size-6"
            />
            <span className="text-gray-300">{account.name}</span>
          </div>
          <button
            className={`px-3 py-1 rounded ${
              account.connected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } transition duration-200`}
            onClick={() => {
              setConnectedAccounts(
                connectedAccounts.map((acc) => {
                  if (acc.id === account.id) {
                    return {
                      ...acc,
                      connected: !acc.connected,
                    };
                  }
                  return acc;
                })
              );
            }}
          >
            {account.connected ? "Connected" : "Connect"}
          </button>
        </div>
      ))}
      <button className="flex items-center mt-4 text-indigo-400 transition duration-200 hover:text-indigo-300">
        <Plus size={18} className="mr-2" /> Add Account
      </button>
    </SettingSection>
  );
};
export default ConnectedAccounts;
