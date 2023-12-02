import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { LogInUser } from "../../networks/user.api";
import axios from "axios";
import { User } from "../../models/user.model";
import Loader from "../../components/Loader";

interface logInProps {
  onLogIn: (user: User) => void;
}
const LogIn = ({ onLogIn }: logInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [logInError, setLogInError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setLogInError(null);
      const logInUser = await LogInUser(formData);
      onLogIn(logInUser);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setLogInError("invalid email or password");
        } else {
          setLogInError("An error occurred while making the request.");
        }
      } else {
        setLogInError("An unexpected error occurred, Please try again.");
      }
    }
  };
  return (
    <section className="absolute z-50 min-h-screen w-full">
      <div
        onClick={() => navigate("/")}
        className="absolute h-full w-full bg-black/40"
      />
      {loading && (
        <div className="absolute h-full w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="max-w-[600px] my-4 relative h-full bg-[var(--light)] rounded-3xl p-12 mx-auto">
        <Link
          to="/"
          className="absolute right-4 top-4 hover:bg-[var(--sec-light)] p-2 rounded-full"
        >
          <FaXmark className=" text-[28px]" />
        </Link>
        <h2 className="text-center text-[30px] font-semibold">
          Welcome to Poterest
        </h2>
        {logInError && <p className="text-center text-red-500">{logInError}</p>}
        <form
          onSubmit={handleLogIn}
          className="flex flex-col items-center justify-center"
        >
          <label className="w-[90%] mt-3" htmlFor="email">
            Email*
          </label>
          <input
            className="w-[90%] py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            spellCheck={false}
            required
            autoFocus
          />
          <label className="w-[90%] mt-3" htmlFor="password">
            Password*
          </label>
          <div className="w-[90%] relative">
            <input
              className="w-full py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
              type={`${showPassword ? "text" : "password"}`}
              value={formData.password}
              onChange={handleChange}
              id="password"
              placeholder="Password"
              required
            />
            {showPassword ? (
              <IoEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-5 top-5 text-[25px] cursor-pointer"
              />
            ) : (
              <IoEye
                onClick={() => setShowPassword(true)}
                className="absolute right-5 top-5 text-[25px] cursor-pointer"
              />
            )}
          </div>
          <span className="w-[90%] mt-3 hover:underline">
            Forgot your password?
          </span>
          <button
            disabled={loading}
            className="w-[90%] disabled:bg-[var(--sec-red)] py-4 px-8 mt-10 bg-[var(--pri-red)] text-[22px] hover:bg-[var(--sec-red)] text-white rounded-full"
          >
            Log in
          </button>
          <p className="text-center my-4">OR</p>
          <button
            type="button"
            className="w-[90%] flex items-center justify-around py-4 px-8 bg-[var(--light)] hover:bg-[#f8faff] md:text-[22px] border-[3px] border-gray-400 rounded-full"
          >
            Continue with google <FcGoogle className="text-[30px]" />
          </button>
        </form>
        <Link to="/signup">
          <p className="mt-6 hover:underline text-center">
            Not on Poterest yet? Sign up
          </p>
        </Link>
      </div>
    </section>
  );
};

export default LogIn;
