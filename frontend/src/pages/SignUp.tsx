import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { SignUpUser } from "../networks/user.api";
import { User } from "../models/user.model";
import Loader from "../components/Loader";

interface SignUpProps {
  onSignUp: (user: User) => void;
}
const SignUp = ({ onSignUp }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSignUpError(null);
      const createdUser = await SignUpUser(formData);
      onSignUp(createdUser);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setSignUpError(error.response?.data.error);
      } else {
        setSignUpError("Unexpected error occured, Please try again.");
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
        <div className="absolute h-screen w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="max-w-[600px] relative my-4 h-full bg-[var(--light)] rounded-3xl p-12 mx-auto">
        <Link
          to="/"
          className="absolute right-4 top-4 hover:bg-[var(--sec-light)] p-2 rounded-full"
        >
          <FaXmark className=" text-[28px]" />
        </Link>
        <h2 className="text-center text-[30px] font-semibold">
          Welcome to Poterest
        </h2>
        {signUpError && (
          <p className="text-center text-red-500">{signUpError}</p>
        )}
        <form
          onSubmit={handleSignUp}
          className="flex flex-col items-center justify-center"
        >
          <label className="w-[90%] mt-3" htmlFor="email">
            Email*
          </label>
          <input
            value={formData.email}
            onChange={handleChange}
            className="w-[90%] py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            type="email"
            id="email"
            placeholder="Email"
            spellCheck={false}
            required
          />
          <label className="w-[90%] mt-3" htmlFor="username">
            Username*
          </label>
          <input
            value={formData.username}
            onChange={handleChange}
            className="w-[90%] py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            id="username"
            placeholder="Username"
            spellCheck={false}
            required
          />
          <label className="w-[90%] mt-3" htmlFor="password">
            Password*
          </label>
          <div className="w-[90%] relative">
            <input
              value={formData.password}
              onChange={handleChange}
              className="w-full py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              placeholder="Create Your Password"
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

          <button
            type="submit"
            className="w-[90%] py-4 px-8 mt-10 bg-[var(--pri-red)] text-[22px] hover:bg-[var(--sec-red)] text-white rounded-full"
          >
            Sign Up
          </button>
          <p className="text-center my-4">OR</p>
          <button
            type="button"
            className="w-[90%] flex items-center justify-around py-4 px-8 bg-[var(--light)] hover:bg-[#f8faff] text-[22px] border-[3px] border-gray-400 rounded-full"
          >
            Continue with google <FcGoogle className="text-[30px]" />
          </button>
        </form>
        <p className="text-center mt-6">
          Already a member? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
