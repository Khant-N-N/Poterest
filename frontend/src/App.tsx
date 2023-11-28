import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { User } from "./models/user.model";
import { GetAuthenticatedUser } from "./networks/user.api";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

const App = () => {
  const [logInUser, setLogInUser] = useState<User | null>(null);
  useEffect(() => {
    const getAuthentication = async () => {
      try {
        const user = await GetAuthenticatedUser();
        setLogInUser(user);
      } catch (error) {
        console.error(error);
      }
    };
    getAuthentication();
  }, []);

  return (
    <>
      <Navbar logInUser={logInUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
