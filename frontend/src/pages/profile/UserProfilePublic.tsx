import axios from "axios";
import { useEffect, useState } from "react";
import { HiShare } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import ProfilePosts from "../../components/UserProfile/ProfilePosts";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import NotiToast from "../../components/NotiToast";

const UserProfilePublic = () => {
  const [thisUser, setThisUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isToast, setIsToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        setError(null);
        setLoading(true);

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
      <NotiToast message="Link Copied" isToast={isToast} />
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
          <div className="fixed top-0 w-full flex justify-end items-center gap-6 py-3 px-4 md:hidden bg-[var(--light)] z-50">
            <HiShare
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setIsToast(true);
                setTimeout(() => setIsToast(false), 1000);
              }}
              className="text-[25px] cursor-pointer"
            />
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
            <Link to="/edit" className="bg-[var(--sec-light)] p-4 rounded-full">
              Message
            </Link>
            <Link to="/edit" className="bg-[var(--sec-light)] p-4 rounded-full">
              Follow
            </Link>
          </div>

          <ProfilePosts />
        </main>
      )}
    </>
  );
};

export default UserProfilePublic;
