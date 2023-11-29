import { Link } from "react-router-dom";

const SavedPosts = () => {
  return (
    <div className="text-center my-20 px-3 tracking-wide">
      You haven't saved any Posts yet.{" "}
      <Link
        to="/"
        className="bg-[var(--sec-light)] hover:bg-gray-400 p-4 block w-40 mx-auto rounded-full mt-4"
      >
        Find Ideas
      </Link>
    </div>
  );
};

export default SavedPosts;
