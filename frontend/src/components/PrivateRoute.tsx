import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  return logInUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
