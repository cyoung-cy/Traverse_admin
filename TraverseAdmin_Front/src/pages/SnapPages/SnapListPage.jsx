import SnapTable from "../../components/snap/SnapTable";
import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import { useState } from "react";

const SnapListPage = () => {
  const [title] = useState("스냅 관리");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-auto relative z-10 flex-1">
        <Header title={title} />
        <div className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
          <SnapTable />
        </div>
      </div>
    </motion.div>
  );
};

export default SnapListPage;
