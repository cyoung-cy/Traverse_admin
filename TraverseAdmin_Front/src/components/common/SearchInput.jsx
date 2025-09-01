import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "검색...", onClear }) => (
  <div className="relative flex-1 max-w-sm">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="py-2 pr-8 pl-10 w-full text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
    {value && (
      <button
        type="button"
        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-200"
        onClick={onClear}
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export default SearchInput;
