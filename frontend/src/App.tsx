import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState, useEffect, lazy, Suspense } from "react";
import { User } from "./models/user.model";
import { GetAuthenticatedUser } from "./networks/user.api";
import Loader from "./components/Loader";
import type { RootState } from "./app/store";
import { useSelector, useDispatch } from "react-redux";
import { getAuthenticatedUser } from "./features/userSlice";
const LogIn = lazy(() => import("./pages/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const LogInHome = lazy(() => import("./pages/LogInHome"));

const App = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const getAuthentication = async () => {
      try {
        setLoading(true);
        const user = await GetAuthenticatedUser();
        dispatch(getAuthenticatedUser(user));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    getAuthentication();
  }, []);

  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        {loading ? (
          <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={logInUser ? <LogInHome /> : <Home />} />
            <Route
              path="/login"
              element={
                <LogIn
                  onLogIn={(user) => dispatch(getAuthenticatedUser(user))}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <SignUp
                  onSignUp={(user) => dispatch(getAuthenticatedUser(user))}
                />
              }
            />
          </Routes>
        )}
      </Suspense>
    </>
  );
};

export default App;
