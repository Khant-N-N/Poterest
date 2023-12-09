import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import Post from "../CreatePost/Post";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  850: 2,
};

const SavedPosts = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="text-center my-20 px-3 tracking-wide">
      {logInUser && logInUser?.saved.length < 1 ? (
        <>
          You haven't saved any Posts yet.{" "}
          <Link
            to="/"
            className="bg-[var(--sec-light)] hover:bg-gray-400 p-4 block w-40 mx-auto rounded-full mt-4"
          >
            Find Ideas
          </Link>
        </>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="w-[90vw] flex gap-3"
        >
          {logInUser?.saved.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default SavedPosts;
