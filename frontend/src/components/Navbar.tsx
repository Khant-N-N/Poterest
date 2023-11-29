import { Link, NavLink } from "react-router-dom";
import { TfiPinterest } from "react-icons/tfi";
import { AiFillMessage } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import { RootState } from "../app/store";

const Navbar = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);

  return (
    <nav className="flex z-30 w-full fixed top-0 items-center justify-between px-14 md:px-20 py-4 text-[20px] font-semibold">
      <Link to="/" className="text-[var(--pri-red)] text-[23px]">
        <TfiPinterest className="text-[30px]" /> {!logInUser && "Poterest"}
      </Link>
      {logInUser && (
        <div className="hidden md:flex gap-2">
          <NavLink
            to="/"
            className={(isActive) =>
              isActive
                ? "bg-black text-white p-5 rounded-full"
                : "p-5 rounded-full"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={(isActive) =>
              isActive
                ? "bg-black text-white p-5 rounded-full"
                : "p-5 rounded-full"
            }
          >
            Create
          </NavLink>
        </div>
      )}
      {logInUser ? (
        <div className="md:flex items-center w-4/5 justify-between hidden">
          <SearchBox />

          <div className="flex items-center gap-8">
            <NavLink
              to="/message"
              className={(isActive) =>
                isActive ? "text-black" : "text-[var(--sec-light)]"
              }
            >
              <AiFillMessage className="text-[40px]" />
            </NavLink>
            <NavLink
              to="/profile"
              className={(isActive) =>
                isActive
                  ? "border-2 border-black p-1 w-10 h-10 rounded-full overflow-hidden"
                  : "w-10 h-10 rounded-full overflow-hidden"
              }
            >
              <img
                src={logInUser?.avatar}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </NavLink>
            <FaChevronDown />
          </div>
        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="p-4 bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white rounded-full"
          >
            Log In
          </Link>
          <Link
            to="/signUp"
            className="p-4 bg-[var(--sec-light)] hover:bg-gray-400 rounded-full ms-3"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
