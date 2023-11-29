import { Link } from "react-router-dom";

const CreatedPosts = () => {
  return (
    <div className="text-center my-20 px-3 tracking-wide">
      Nothing to show...yet! Posts you create will live here.
      <Link
        to="/create"
        className="bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white p-4 block w-40 mx-auto rounded-full mt-4"
      >
        Create Post
      </Link>
    </div>
  );
};

export default CreatedPosts;
