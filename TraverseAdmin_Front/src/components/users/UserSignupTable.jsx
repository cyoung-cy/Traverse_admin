import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const UserSignupTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [signupData, setSignupData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 임시 데이터 - 실제로는 API에서 가져와야 함
  useEffect(() => {
    setSignupData([
      {
        id: 1,
        date: new Date(),
        total_signups: 150,
        email_verify: 120,
        phone_verify: 100,
        completed: 95,
        conversion_rate: 63.3,
      },
      // ... 더 많은 데이터
    ]);
    setLoading(false);
  }, []);

  return (
      <motion.div
          className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            가입 대기 리스트
          </h2>
          <div className="relative">
            <input
                type="text"
                placeholder="날짜 검색..."
                className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
            <p className="text-gray-300">로딩 중...</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    총 가입시도
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    이메일 인증
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    휴대폰 인증
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    가입 완료
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-400 uppercase">
                    전환율
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {signupData.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-center text-gray-300 whitespace-nowrap">
                        {data.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-300 whitespace-nowrap">
                        {data.total_signups}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-green-300 whitespace-nowrap">
                        {data.email_verify}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-blue-300 whitespace-nowrap">
                        {data.phone_verify}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-purple-300 whitespace-nowrap">
                        {data.completed}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-yellow-300 whitespace-nowrap">
                        {data.conversion_rate}%
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-indigo-400 hover:text-indigo-300"
          >
            Previous
          </button>
          <div className="text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
          <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-indigo-400 hover:text-indigo-300"
          >
            Next
          </button>
        </div>
      </motion.div>
  );
};

export default UserSignupTable;
