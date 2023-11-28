import { User } from "../models/user.model";
import { Link } from "react-router-dom";

interface NavProps {
  logInUser: User | null;
}
const Navbar = ({ logInUser }: NavProps) => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 text-[20px] font-semibold">
      <div>Poterest</div>
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
