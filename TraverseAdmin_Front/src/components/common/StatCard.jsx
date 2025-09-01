import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="overflow-hidden bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md max-w-[160px] w-full"
      whileHover={{ y: -3, boxShadow: "0 10px 20px -8px rgba(0, 0, 0, 0.4)" }}
    >
      <div className="px-2 py-2 sm:p-2">
        <span className="flex items-center text-xs font-medium text-gray-400">
          <Icon size={16} className="mr-1.5" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-xl font-semibold text-gray-100">{value}</p>
      </div>
    </motion.div>
  );
};
export default StatCard;
