import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import ProfilePosts from "../../components/UserProfile/ProfilePosts";
import { RiSettingsFill } from "react-icons/ri";
import { HiShare } from "react-icons/hi";

const UserProfile = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  return (
    <main className="flex flex-col items-center gap-4 justify-center min-h-screen mt-24">
      <div className="fixed z-50 top-0 w-full flex justify-end items-center gap-6 py-3 px-4 md:hidden bg-[var(--light)]">
        <HiShare className="text-[25px] cursor-pointer" />
        <RiSettingsFill className="text-[25px] cursor-pointer" />
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

      <ProfilePosts />
    </main>
  );
};

export default UserProfile;
