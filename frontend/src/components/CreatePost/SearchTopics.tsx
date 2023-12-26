import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface SearchTopicsProps {
  onSearch: (keyword: string) => void;
}
const SearchTopics = ({ onSearch }: SearchTopicsProps) => {
  const [isType, setIsType] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const handleSearchTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsType(true);
    setSearchKeyword(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <div className="relative">
      <input
        type="text"
        id="searchTopic"
        value={searchKeyword}
        onChange={handleSearchTopic}
        placeholder="Search Topics"
        className="bg-[var(--light)] rounded-2xl shadow-2xl px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
      />
      {isType ? (
        <FaXmark
          onClick={() => {
            setSearchKeyword("");
            onSearch("");
            setIsType(false);
          }}
          className="absolute right-3 top-3 cursor-pointer"
        />
      ) : (
        <FaSearch className="absolute right-3 top-3 cursor-pointer" />
      )}
    </div>
  );
};

export default SearchTopics;
