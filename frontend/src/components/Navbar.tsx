import { Link, NavLink } from "react-router-dom";
import { TfiPinterest } from "react-icons/tfi";
import { AiFillMessage } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import { RootState } from "../app/store";
import { useEffect, useRef, useState } from "react";

interface NavProps {
  setIsLogOut: (boolean: boolean) => void;
  setIsDelete: (boolean: boolean) => void;
}
const Navbar = ({ setIsLogOut, setIsDelete }: NavProps) => {
  const [showSetting, setShowSetting] = useState(false);

  const { logInUser } = useSelector((state: RootState) => state.user);
  const displaySettingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        displaySettingRef.current &&
        !displaySettingRef.current.contains(target)
      ) {
        setShowSetting(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [displaySettingRef]);

  return (
    <nav className="flex z-30 w-full fixed top-0 bg-[var(--light)] items-center justify-end md:justify-between gap-2 px-8 lg:px-20 py-3 lg:text-[20px] font-semibold">
      <Link
        to="/"
        className="text-[var(--pri-red)] text-[23px] hidden md:flex gap-3"
      >
        <TfiPinterest className="text-[30px]" /> {!logInUser && "Poterest"}
      </Link>
      {logInUser && (
        <div className="hidden md:flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-black text-white p-5 rounded-full"
                : "p-5 rounded-full hover:bg-[var(--sec-light)]"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "bg-black text-white p-5 rounded-full"
                : "p-5 rounded-full hover:bg-[var(--sec-light)]"
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
              className={({ isActive }) =>
                isActive
                  ? "text-black"
                  : "hover:bg-[var(--sec-light)] text-gray-400 rounded-full p-2"
              }
            >
              <AiFillMessage className="text-[40px]" />
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "border-2 border-black p-1 w-10 h-10 rounded-full overflow-hidden"
                  : "w-10 h-10 rounded-full overflow-hidden hover:bg-[var(--sec-light)]"
              }
            >
              <img
                src={logInUser?.avatar}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </NavLink>
            <div className="relative">
              <FaChevronDown
                onClick={() => setShowSetting(!showSetting)}
                className="cursor-pointer"
              />
              {showSetting && (
                <div
                  ref={displaySettingRef}
                  className="absolute right-0 text-[18px] font-normal w-[200px] flex flex-col gap-4 bg-[var(--sec-light)] py-5 px-4 shadow rounded top-9"
                >
                  <Link
                    to="/edit"
                    onClick={() => setShowSetting(false)}
                    className="text-center hover:opacity-60"
                  >
                    Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogOut(true);
                      setShowSetting(false);
                    }}
                    className="hover:opacity-60"
                  >
                    Log Out
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDelete(true);
                      setShowSetting(false);
                    }}
                    className="hover:opacity-60"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
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
