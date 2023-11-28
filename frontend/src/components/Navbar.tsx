import { User } from "../models/user.model";
import { Link } from "react-router-dom";

interface NavProps {
  logInUser: User | null;
}
const Navbar = ({ logInUser }: NavProps) => {
  return (
    <nav className="flex z-30 w-full fixed top-0 items-center justify-between px-14 md:px-20 py-6 text-[20px] font-semibold">
      <Link to="/" className="text-[var(--pri-red)] text-[23px]">
        Poterest
      </Link>
      {logInUser ? (
        <></>
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
