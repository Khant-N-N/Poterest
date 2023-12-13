import React from "react";
import { useSelector } from "react-redux";
import { Post } from "../../models/post.model";
import { RootState } from "../../app/store";

interface AddCommentProps {
  postData: Post;
}

const AddComment = ({ postData }: AddCommentProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex gap-2 items-center">
      <img
        src={logInUser?.avatar}
        alt="my profile"
        className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover"
      />
      {postData?.allowComment ? (
        <input
          type="text"
          placeholder="Add a comment"
          className="p-4 bg-[var(--sec-light)] focus:bg-transparent focus:border rounded-full w-full"
        />
      ) : (
        <p className="text-gray-400 text-[15px] md:text-[19px]">
          This comment section is disabled by the owner
        </p>
      )}
    </div>
  );
};

export default AddComment;
