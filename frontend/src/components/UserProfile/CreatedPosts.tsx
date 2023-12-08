import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Post as PostType } from "../../models/post.model";
import Post from "../CreatePost/Post";
import { GetUserPosts } from "../../networks/post.api";
import Loader from "../Loader";
import Masonry from "react-masonry-css";
import { useDispatch } from "react-redux";
import { addCreatedPosts } from "../../features/postSlice";

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  850: 2,
};

const CreatedPost = () => {
  const [createdPosts, setCreatedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const getMyCreatedPost = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await GetUserPosts();
      setCreatedPosts(data);
      dispatch(addCreatedPosts(data));
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMyCreatedPost();
  }, [getMyCreatedPost]);

  return (
    <div
      className={`${
        error && "text-red-500"
      } text-center mt-16 mb-20 px-3 tracking-wide`}
    >
      {!loading && createdPosts.length === 0 && (
        <>
          Nothing to show...yet! Posts you create will live here.
          <Link
            to="/create"
            className="bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white p-4 block w-40 mx-auto rounded-full mt-4"
          >
            Create Post
          </Link>
        </>
      )}
      {loading && <Loader />}
      {error && "Something went wrong! Please refresh the page."}
      {!loading && !error && createdPosts && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="w-[90vw] flex gap-3"
        >
          {createdPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </Masonry>
      )}
    </div>
  );
};

export const CreatedPosts = React.memo(CreatedPost);
