import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfilePosts from "../../components/UserProfile/ProfilePosts";
import { RiSettingsFill } from "react-icons/ri";
import { HiShare } from "react-icons/hi";
import { User } from "../../models/user.model";
import { GetAuthenticatedUser, GetTargetUser } from "../../networks/user.api";
import axios from "axios";
import Loader from "../../components/Loader";

const UserProfilePublic = () => {
  const [thisUser, setThisUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMyAcc, setIsMyAcc] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        setError(null);
        setLoading(true);
        setIsMyAcc(false);
        const isAuthenticated = await GetAuthenticatedUser();
        if (isAuthenticated._id === userId) setIsMyAcc(true);

        const user = await GetTargetUser(userId!);
        setThisUser(user);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response) setError(error.response.data.error);
          else setError("something went wrong, please try again");
        }
      }
    };
    getUserData();
  }, [userId]);
  return (
    <>
      {loading && (
        <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      {error && (
        <p className="text-center h-screen flex justify-center items-center text-red-500">
          {error}
        </p>
      )}
      {!loading && !error && (
        <main className="flex flex-col items-center gap-4 justify-center min-h-screen mt-24">
          <div className="fixed top-0 w-full flex justify-end items-center gap-6 py-3 px-4 md:hidden bg-[var(--light)]">
            <HiShare className="text-[25px] cursor-pointer" />
            <RiSettingsFill className="text-[25px] cursor-pointer" />
          </div>
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <img
              src={thisUser?.avatar}
              alt="profile"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
          <h3 className="text-[30px] md:text-[36px]">{thisUser?.username}</h3>
          <h4>0 following</h4>
          <div className="flex gap-3">
            <Link
              to="/edit"
              className="bg-[var(--sec-light)] p-4 rounded-full hidden md:inline-block"
            >
              {isMyAcc ? "Share" : "Message"}
            </Link>
            <Link to="/edit" className="bg-[var(--sec-light)] p-4 rounded-full">
              {isMyAcc ? "Edit Profile" : "Follow"}
            </Link>
          </div>

          <ProfilePosts />
        </main>
      )}
    </>
  );
};

export default UserProfilePublic;
