import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logOut_delete } from "../features/userSlice";
import { GetAuthenticatedUser } from "../networks/user.api";
import Loader from "../components/Loader";
import { Post } from "../models/post.model";
import { GetPublicAllPosts } from "../networks/post.api";
import Masonry from "react-masonry-css";
import PostCard from "../components/CreatePost/Post";

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  850: 2,
};

const LogInHomeC = () => {
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getPublicPosts = useCallback(async () => {
    try {
      setLoading(true);
      const posts = await GetPublicAllPosts();
      setPublicPosts(posts);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getPublicPosts();
  }, [getPublicPosts]);

  const checkStillAuthenticated = useCallback(async () => {
    try {
      setLoading(true);
      await GetAuthenticatedUser();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(logOut_delete());
    }
  }, [dispatch]);

  useEffect(() => {
    checkStillAuthenticated();
  }, [checkStillAuthenticated]);

  return (
    <div className="mt-10 md:mt-28 mb-20 md:mb-10 relative">
      {loading ? (
        <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="w-[90vw] gap-3 flex mx-auto"
        >
          {publicPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Masonry>
      )}
    </div>
  );
};
const LogInHome = React.memo(LogInHomeC);
export default LogInHome;
