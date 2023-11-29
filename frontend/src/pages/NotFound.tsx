import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center text-[20px] w-full h-screen justify-center items-center flex flex-col gap-3">
      404 NotFound <br />{" "}
      <Link to="/" className="hover:underline text-blue-500">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
