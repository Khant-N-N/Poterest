import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState, useEffect, lazy, Suspense } from "react";
import { User } from "./models/user.model";
import { GetAuthenticatedUser } from "./networks/user.api";
import Loader from "./components/Loader";
const LogIn = lazy(() => import("./pages/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const LogInHome = lazy(() => import("./pages/LogInHome"));

const App = () => {
  const [logInUser, setLogInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getAuthentication = async () => {
      try {
        setLoading(true);
        const user = await GetAuthenticatedUser();
        setLogInUser(user);
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
      <Navbar logInUser={logInUser} />
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
              element={<LogIn onLogIn={(user) => setLogInUser(user)} />}
            />
            <Route
              path="/signup"
              element={<SignUp onSignUp={(user) => setLogInUser(user)} />}
            />
          </Routes>
        )}
      </Suspense>
    </>
  );
};

export default App;
