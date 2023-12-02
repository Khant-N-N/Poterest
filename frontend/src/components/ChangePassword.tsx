import axios from "axios";
import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ChangeNewPassword } from "../networks/user.api";

const initialForm = {
  currentPassword: "",
  newPassword: "",
};
const ChangePassword = () => {
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwLoading, setpwLoading] = useState(false);
  const [completeMsg, setCompleteMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const handleChangePassword = async () => {
    if (formData.currentPassword === "" || formData.newPassword === "")
      return setError("Please enter password");
    try {
      setError(null);
      setpwLoading(true);
      await ChangeNewPassword(formData);
      setpwLoading(false);
      setCompleteMsg("Password Changed");
      setTimeout(() => {
        setChangePassword(false);
        setCompleteMsg("");
        setFormData(initialForm);
      }, 2000);
    } catch (error) {
      setpwLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  return (
    <>
      <p
        onClick={() => setChangePassword(true)}
        className="mt-4 py-1 px-3 border-[3px] hover:bg-gray-300 border-gray-400 rounded-full cursor-pointer"
      >
        Change Password?
      </p>
      {changePassword && (
        <div className="absolute bottom-0 w-full right-0 z-20 flex justify-center py-5">
          <div
            onClick={() => {
              setChangePassword(false);
              setFormData(initialForm);
              setError(null);
            }}
            className="absolute w-screen h-screen bg-black/40 bottom-0 right-0 -z-10"
          />
          <div
            className={`flex flex-col items-center justify-center h-[500px] bg-[var(--light)] w-[290px] md:w-[350px] border-4 rounded p-6`}
          >
            {completeMsg !== "" && (
              <p className="text-green-500 text-[17px]">{completeMsg}</p>
            )}
            {error && <p className="text-red-500 text-[17px]">{error}</p>}
            <label className="w-[90%] mt-3" htmlFor="password">
              Current Password*
            </label>
            <div className="w-[90%] relative">
              <input
                className="w-full py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
                type={`${showPassword ? "text" : "password"}`}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                id="password"
                placeholder="Current Password"
                required
                autoFocus
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
            <label className="w-[90%] mt-5" htmlFor="newpassword">
              New Password*
            </label>
            <div className="w-[90%] relative">
              <input
                className="w-full py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
                type={`${showNewPassword ? "text" : "password"}`}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                id="newpassword"
                placeholder="New Password"
                required
              />
              {showNewPassword ? (
                <IoEyeOff
                  onClick={() => setShowNewPassword(false)}
                  className="absolute right-5 top-5 text-[25px] cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => setShowNewPassword(true)}
                  className="absolute right-5 top-5 text-[25px] cursor-pointer"
                />
              )}
            </div>
            <Link to="/forget" className="hover:underline mt-5 w-[90%]">
              Forget Password? Reset Here
            </Link>
            <button
              disabled={pwLoading}
              type="button"
              onClick={handleChangePassword}
              className="bg-[var(--pri-red)] hover:bg-[var(--sec-red)] disabled:opacity-50 text-white w-[90%] mt-5 p-3 rounded-full"
            >
              {pwLoading ? "Changing" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setChangePassword(false);
                setFormData(initialForm);
                setError(null);
              }}
              className="bg-[var(--sec-light)] hover:bg-gray-400 text-center w-[90%] mt-5 p-3 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
