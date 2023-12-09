import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import ProfilePosts from "../../components/UserProfile/ProfilePosts";
import { RiSettingsFill } from "react-icons/ri";
import { HiShare } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";

interface NavProps {
  setIsLogOut: (boolean: boolean) => void;
  setIsDelete: (boolean: boolean) => void;
}
const UserProfile = ({ setIsLogOut, setIsDelete }: NavProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [showSetting, setShowSetting] = useState(false);

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
    <main className="flex flex-col items-center gap-4 justify-center min-h-screen mt-24 relative">
      <div className="fixed z-50 top-0 w-full flex justify-end items-center gap-6 py-3 px-4 md:hidden bg-[var(--light)]">
        <HiShare className="text-[25px] cursor-pointer" />
        <RiSettingsFill
          onClick={() => setShowSetting(true)}
          className="text-[25px] cursor-pointer"
        />

        {showSetting && (
          <div
            ref={displaySettingRef}
            className="absolute right-0 top-3 text-[18px] font-normal w-[200px] flex flex-col gap-4 bg-[var(--sec-light)] pt-4 pb-8 px-4 shadow rounded"
          >
            <FaXmark
              onClick={() => setShowSetting(false)}
              className="self-end cursor-pointer hover:opacity-70"
            />
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
      <div className="w-28 h-28 rounded-full overflow-hidden">
        <img
          src={logInUser?.avatar}
          alt="profile"
          className="w-full h-full object-cover cursor-pointer"
        />
      </div>
      <h3 className="text-[30px] md:text-[36px]">{logInUser?.username}</h3>
      <h4>0 following</h4>
      <div className="flex gap-3">
        <Link
          to="/edit"
          className="bg-[var(--sec-light)] p-4 rounded-full hidden md:inline-block"
        >
          Share
        </Link>
        <Link to="/edit" className="bg-[var(--sec-light)] p-4 rounded-full">
          Edit Profile
        </Link>
      </div>

      <ProfilePosts Save={true} />
    </main>
  );
};

export default UserProfile;
