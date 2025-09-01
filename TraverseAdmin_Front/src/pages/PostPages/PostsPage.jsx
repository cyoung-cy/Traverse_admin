import { useState } from "react";
import { motion } from "framer-motion";
import PostsTable from "../../components/posts/PostsTable";
import Header from "./../../components/common/Header";

const PostsPage = () => {
  const [title] = useState("게시물 관리");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className=""
    >
      <div className="overflow-auto relative z-10 flex-1">
        <Header title={title} />
        <div className="px-8 py-6 mx-auto max-w-[1920px] lg:px-12">
          <PostsTable />
        </div>
      </div>
    </motion.div>
  );
};

export default PostsPage;
