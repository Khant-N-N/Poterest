import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut_delete } from "../features/userSlice";
import { GetAuthenticatedUser } from "../networks/user.api";
import Loader from "../components/Loader";

const LogInHome = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkStillAuthenticated = async () => {
      try {
        setLoading(true);
        await GetAuthenticatedUser();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(logOut_delete());
      }
    };
    checkStillAuthenticated();
  }, [dispatch]);
  return (
    <div>
      {loading ? (
        <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        "Login home"
      )}
    </div>
  );
};

export default LogInHome;
