import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import type { RootState } from "./app/store";
import { useSelector, useDispatch } from "react-redux";
import { getAuthenticatedUser } from "./features/userSlice";
import PrivateRoute from "./components/PrivateRoute";
import MobileNav from "./components/MobileNav";
import UserProfilePublic from "./pages/UserProfilePublic";

const LogIn = lazy(() => import("./pages/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const LogInHome = lazy(() => import("./pages/LogInHome"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const MessageInbox = lazy(() => import("./pages/MessageInbox"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

const App = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      <MobileNav />
      <Suspense
        fallback={
          <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={logInUser ? <LogInHome /> : <Home />} />
          <Route path="/profile/:userId" element={<UserProfilePublic />} />
          <Route
            path="/login"
            element={
              <LogIn onLogIn={(user) => dispatch(getAuthenticatedUser(user))} />
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
          <Route element={<PrivateRoute />}>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/message" element={<MessageInbox />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
