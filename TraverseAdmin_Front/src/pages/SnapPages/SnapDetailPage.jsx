import SnapDetail from "../../components/snap/SnapDetail";
import Header from "../../components/common/Header";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const SnapDetailPage = () => {
  const { snapId } = useParams();
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-auto relative z-10 flex-1">
        <Header title="스냅 상세 정보" />
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center px-2 py-1 mb-2 text-xs text-gray-400 rounded transition-colors hover:text-gray-200 hover:bg-gray-700"
          >
            <ArrowLeft size={32} className="mr-3 text-blue-400" />
            <span className="text-base font-semibold">뒤로가기</span>
          </button>
        </div>
        <div className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
          <SnapDetail snapId={snapId} />
        </div>
      </div>
    </motion.div>
  );
};

export default SnapDetailPage;
