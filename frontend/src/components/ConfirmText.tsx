import { DeleteUser, LogOutUser } from "../networks/user.api";
import { logOut_delete } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";

interface ConfirmProps {
  onDisplay: (boolean: boolean) => void;
  isDisplay: boolean;
  text: string;
}
const ConfirmText = ({ onDisplay, isDisplay, text }: ConfirmProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const handleConfirm = async () => {
    try {
      setError(null);
      setLoading(true);
      if (text === "LogOut") await LogOutUser();
      if (text === "Delete")
        await DeleteUser({ password: passwordRef.current?.value });
      dispatch(logOut_delete());
      onDisplay(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        isDisplay ? "scale-100" : "scale-0"
      } h-full w-full fixed top-0 transition-all z-40 flex flex-col justify-center items-center`}
    >
      <div
        onClick={() => {
          onDisplay(false);
          setError(null);
        }}
        className="absolute h-full w-full z-10"
      />
      <div className="w-[270px] md:w-[330px] bg-[var(--sec-light)] gap-5 shadow-lg z-20 px-4 py-6 rounded-md flex flex-col justify-center items-center">
        <p className="text-center">
          Please Confirm to {text} {text === "Delete" && "Your account"}
        </p>
        {text === "Delete" && isDisplay && (
          <>
            <p className="text-[16px] text-yellow-700">
              *You will lose all your data and can't be restore
            </p>
            {error && <p className="text-[16px] text-red-500">{error}</p>}
            <div className="w-full relative">
              <input
                ref={passwordRef}
                className="w-full py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
                type={`${showPassword ? "text" : "password"}`}
                id="deletePassword"
                placeholder="Enter Your Password"
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
          </>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              onDisplay(false);
              setError(null);
            }}
            className="hover:bg-gray-300 bg-gray-400 py-3 px-5 rounded-full"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleConfirm}
            type="button"
            className="bg-[var(--pri-red)] disabled:opacity-40 text-white hover:bg-[var(--sec-red)] py-3 px-5 rounded-full"
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmText;
