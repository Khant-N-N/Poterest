import { LogOutUser } from "../networks/user.api";
import { logOut_delete } from "../features/userSlice";
import { useDispatch } from "react-redux";

interface ConfirmProps {
  onDisplay: (boolean: boolean) => void;
  isDisplay: boolean;
  text: string;
}
const ConfirmText = ({ onDisplay, isDisplay, text }: ConfirmProps) => {
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    try {
      if (text === "LogOut") await LogOutUser();
      if (text === "Delete") await LogOutUser();
      dispatch(logOut_delete());
      onDisplay(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`${
        isDisplay ? "scale-100" : "scale-0"
      } h-full w-full absolute top-0 transition-all z-40 flex flex-col justify-center items-center`}
    >
      <div
        onClick={() => onDisplay(false)}
        className="absolute h-full w-full z-10"
      />
      <div className="w-[270px] bg-[var(--sec-light)] gap-5 shadow-lg z-20 px-4 py-6 rounded-md flex flex-col justify-center items-center">
        <p>Please Confirm to {text}</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onDisplay(false)}
            className="hover:bg-gray-300 bg-gray-400 py-3 px-5 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            className="bg-[var(--pri-red)] text-white hover:bg-[var(--sec-red)] py-3 px-5 rounded-full"
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmText;
