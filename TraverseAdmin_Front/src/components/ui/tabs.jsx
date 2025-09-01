import React from "react";
import { motion } from "framer-motion";

const TabsContext = React.createContext(null);

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);

  const contextValue = React.useMemo(() => {
    return {
      value: value !== undefined ? value : selectedValue,
      onValueChange: (newValue) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
      },
    };
  }, [value, selectedValue, onValueChange]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={`flex space-x-2 border-b border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      className={`relative px-3 py-2 text-sm font-medium transition-all outline-none focus:outline-none ${
        isActive
          ? "text-white"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-700 hover:bg-opacity-30"
      } ${className}`}
      onClick={() => context?.onValueChange(value)}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="tabIndicator"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
