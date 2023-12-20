import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../models/post.model";
import { RootState } from "../../app/store";
import { IoSend } from "react-icons/io5";
import { AddCommentsToPost } from "../../networks/post.api";
import { setAddComments } from "../../features/postSlice";
interface AddCommentProps {
  postData: Post;
}

const AddComment = ({ postData }: AddCommentProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText === "") return;
    try {
      setError(false);
      setLoading(true);
      const newComment = {
        commenterId: logInUser?._id,
        comment: commentText,
      };
      const newAddedComments = await AddCommentsToPost(
        postData._id,
        newComment
      );
      dispatch(setAddComments(newAddedComments));
      setLoading(false);
      setCommentText("");
    } catch (error) {
      console.log(error);

      setError(true);
      setLoading(false);
    }
  };
  return (
    <>
      {error && (
        <p className="text-center text-red-500 text-[16px]">
          Something went wrong! please try again.
        </p>
      )}
      <form
        onSubmit={handleAddComment}
        className="flex gap-2 items-center relative"
      >
        <img
          src={logInUser?.avatar}
          alt="my profile"
          className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover"
        />
        {postData?.allowComment ? (
          <>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
              placeholder="Add a comment"
              className="p-4 bg-[var(--sec-light)] focus:bg-transparent focus:border-2 outline-none rounded-full w-full"
            />
            <button
              disabled={loading || commentText === ""}
              className="absolute disabled:opacity-40 right-4 bg-[var(--pri-red)] p-2 rounded-full text-white"
            >
              <IoSend />
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-[15px] md:text-[19px]">
            This comment section is disabled by the owner
          </p>
        )}
      </form>
    </>
  );
};

export default AddComment;
