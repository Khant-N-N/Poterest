import { AiFillMessage } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { TiPlus } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

const MobileNav = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);

  return (
    <nav className="fixed md:hidden bottom-0 w-full flex items-center justify-between bg-[var(--light)] px-5 py-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <IoMdHome className="text-[29px]" />
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <FaSearch className="text-[24px]" />
      </NavLink>
      <NavLink
        to="/create"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <TiPlus className="text-[32px]" />
      </NavLink>
      <NavLink
        to="/message"
        className={({ isActive }) =>
          isActive ? "text-black" : "text-gray-400"
        }
      >
        <AiFillMessage className="text-[29px]" />
      </NavLink>
      <NavLink
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
