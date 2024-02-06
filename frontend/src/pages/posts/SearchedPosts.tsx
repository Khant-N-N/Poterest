import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Loader from "../../components/Loader";
import Masonry from "react-masonry-css";
import PostCard from "../../components/CreatePost/Post";
import SearchBox from "../../components/SearchBox";

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  850: 2,
};

const SearchedPosts = () => {
  const { searchedPosts, loading, searchKeyword } = useSelector(
    (state: RootState) => state.post
  );

  return (
    <>
      <div className="mt-10 md:mt-28 mb-20 md:mb-10 relative px-3">
        <SearchBox isMobile={true} />
        <p className="ms-5 my-5">
          You searched for :{" "}
          <span className="text-[var(--pri-red)]">{searchKeyword}</span>
        </p>
        {!loading && !searchedPosts.length && (
          <p className="text-center mt-10">No result found!</p>
        )}
        {loading ? (
          <div className="h-full w-full z-50 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="w-[90vw] gap-3 flex mx-auto"
          >
            {searchedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Masonry>
        )}
      </div>
    </>
  );
};

export default SearchedPosts;
