import React, { useCallback, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addCreatedPosts } from "../../features/postSlice";
import { GetTargetUserPosts, GetUserPosts } from "../../networks/post.api";
import Post from "../CreatePost/Post";
import Loader from "../Loader";
import { RootState } from "../../app/store";

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  850: 2,
};

const CreatedPost = () => {
  const { userId } = useParams();
  const { createdPosts } = useSelector((state: RootState) => state.post);
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const userCreatedPost = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = userId && (await GetTargetUserPosts(userId));
      if (data) {
        dispatch(addCreatedPosts(data));
        setLoading(false);
        return;
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [dispatch, userId]);

  const getMyCreatedPost = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await GetUserPosts();
      dispatch(addCreatedPosts(data));
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    (userId && userId === logInUser?._id) || !userId
      ? getMyCreatedPost()
      : userCreatedPost();
  }, [getMyCreatedPost, logInUser?._id, userCreatedPost, userId]);

  return (
    <div
      className={`${
        error && "text-red-500"
      } text-center mt-16 mb-20 px-3 tracking-wide`}
    >
      {!loading && createdPosts?.length === 0 && (
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
