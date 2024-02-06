import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { FindPosts } from "../networks/post.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setSearchedPosts,
  setTheLoading,
  setSearchKeyword,
} from "../features/postSlice";

const SearchBox = ({ isMobile }: { isMobile: boolean }) => {
  const [keyword, setKeyword] = useState("");
  const [isType, setIsType] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setKeyword(e.target.value);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      dispatch(setTheLoading(true));
      dispatch(setSearchKeyword(keyword));
      navigate("/searched-posts");
      const data = await FindPosts(keyword);
      dispatch(setSearchedPosts(data));
      dispatch(setTheLoading(false));
    } catch (error) {
      dispatch(setTheLoading(false));
      console.log(error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`relative ${isMobile && "md:hidden"}`}
      >
        {!isType && (
          <FaSearch className="absolute left-4 top-5 text-gray-500" />
        )}
        {isType && (
          <FaXmark
            onClick={() => {
              setIsType(false);
              setKeyword("");
            }}
            className="absolute right-4 top-[1.2rem] rounded-full cursor-pointer text-[25px] hover:bg-[var(--sec-light)]"
          />
        )}
        <input
          onClick={() => setIsType(true)}
          value={keyword}
          onChange={handleChange}
          type="text"
          id="searchBox"
          placeholder={`${!isType ? "    " : ""} Search`}
          className={`font-normal py-4 px-5 rounded-full bg-[#e1e1e1] w-full md:w-[20rem] lg:w-[30rem] xl:w-[40rem] focus:outline-none focus:ring focus:border-blue-400`}
        />
      </form>
    </>
  );
};

export default SearchBox;
