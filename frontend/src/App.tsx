import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "./components/Loader";
import type { RootState } from "./app/store";
import { useSelector, useDispatch } from "react-redux";
import { getAuthenticatedUser } from "./features/userSlice";
import PrivateRoute from "./components/PrivateRoute";
import MobileNav from "./components/MobileNav";
import UserProfilePublic from "./pages/profile/UserProfilePublic";
import ConfirmText from "./components/ConfirmText";
import { showPostDetail } from "./features/postSlice";

const LogIn = lazy(() => import("./pages/signin-up/LogIn"));
const SignUp = lazy(() => import("./pages/signin-up/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const LogInHome = lazy(() => import("./pages/LogInHome"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreatePost = lazy(() => import("./pages/posts/CreatePost"));
const PostDetails = lazy(() => import("./pages/posts/PostDetails"));
const EditPost = lazy(() => import("./pages/posts/EditPost"));
const MessageInbox = lazy(() => import("./pages/MessageInbox"));
const UserProfile = lazy(() => import("./pages/profile/UserProfile"));
const ProfileEdit = lazy(() => import("./pages/profile/ProfileEdit"));
const SearchedPosts = lazy(() => import("./pages/posts/SearchedPosts"));

const App = () => {
  const { isPostDetailShow } = useSelector((state: RootState) => state.post);
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [isLogOut, setIsLogOut] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showPostDetail(false));
  }, [dispatch]);

  return (
    <>
      <Navbar setIsDelete={setIsDelete} setIsLogOut={setIsLogOut} />
      {logInUser && <MobileNav />}
      <Suspense
        fallback={
          <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        {isPostDetailShow && <PostDetails />}
        <ConfirmText
          text="LogOut"
          onDisplay={(boolean) => setIsLogOut(boolean)}
          isDisplay={isLogOut}
        />

        <ConfirmText
          text="Delete"
          onDisplay={(boolean) => setIsDelete(boolean)}
          isDisplay={isDelete}
        />

        <Routes>
          <Route path="/" element={logInUser ? <LogInHome /> : <Home />} />
          <Route path="/profile/:userId" element={<UserProfilePublic />} />
          <Route path="*" element={<NotFound />} />
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
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/message" element={<MessageInbox />} />
            <Route
              path="/profile"
              element={
                <UserProfile
                  setIsDelete={setIsDelete}
                  setIsLogOut={setIsLogOut}
                />
              }
            />
            <Route path="/edit" element={<ProfileEdit />} />
            <Route path="/searched-posts" element={<SearchedPosts />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
