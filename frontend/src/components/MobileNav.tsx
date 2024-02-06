import { AiFillMessage } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { TiPlus } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { showPostDetail } from "../features/postSlice";

const MobileNav = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  return (
    <nav className="fixed md:hidden bottom-0 w-full z-50 flex items-center justify-between bg-[var(--light)] px-5 py-2">
      <NavLink
        onClick={() => dispatch(showPostDetail(false))}
        to="/"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <IoMdHome className="text-[29px]" />
      </NavLink>
      <NavLink
        onClick={() => dispatch(showPostDetail(false))}
        to="/searched-posts"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <FaSearch className="text-[24px]" />
      </NavLink>
      <NavLink
        onClick={() => dispatch(showPostDetail(false))}
        to="/create"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <TiPlus className="text-[32px]" />
      </NavLink>
      <NavLink
        onClick={() => dispatch(showPostDetail(false))}
        to="/message"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <AiFillMessage className="text-[29px]" />
      </NavLink>
      <NavLink
        onClick={() => dispatch(showPostDetail(false))}
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "border-2 border-black p-1 w-9 h-9 rounded-full overflow-hidden"
            : "w-9 h-9 rounded-full overflow-hidden hover:bg-[var(--sec-light)]"
        }
      >
        <img
          src={logInUser?.avatar}
          alt="profile"
          className="w-full h-full object-cover rounded-full"
        />
      </NavLink>
    </nav>
  );
};

export default MobileNav;
