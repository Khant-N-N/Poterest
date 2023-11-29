import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";

const SearchBox = () => {
  const [isType, setIsType] = useState(false);
  const handleChange = () => {
    // setIsType(true);
  };
  return (
    <div className="relative">
      {!isType && <FaSearch className="absolute left-4 top-5 text-gray-500" />}
      {isType && (
        <FaXmark
          onClick={() => setIsType(false)}
          className="absolute right-4 top-[1.2rem] rounded-full cursor-pointer text-[25px] hover:bg-[var(--sec-light)]"
        />
      )}
      <input
        onClick={() => setIsType(true)}
        onChange={handleChange}
        type="text"
        id="searchBox"
        placeholder={`${!isType ? "    " : ""} Search`}
        className="font-normal py-4 px-5 rounded-full bg-[#e1e1e1] md:w-[20rem] lg:w-[30rem] xl:w-[40rem] focus:outline-none focus:ring focus:border-blue-400"
      />
    </div>
  );
};

export default SearchBox;
