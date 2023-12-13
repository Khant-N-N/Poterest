import React, { useCallback, useEffect, useState } from "react";
import { Post } from "../../models/post.model";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GetTargetUser } from "../../networks/user.api";
import { User } from "../../models/user.model";

interface CommentProps {
  postData: Post;
}

const CommentsOfPost = ({ postData }: CommentProps) => {
  const [seeComment, setSeeComment] = useState(false);

  return (
    <div className="mx-5 my-8">
      <p
        onClick={() => setSeeComment(!seeComment)}
        className="font-semibold cursor-pointer hover:border-4 rounded-2xl"
      >
        Comments
      </p>
      {seeComment && (
        <div className="mx-5 md:mx-9">
          {postData.comments.length ? (
            postData.comments.map((comment, key) => (
              <div key={key}>
                <CommentOwner commenterId={comment} />
                <p>{comment}</p>
              </div>
            ))
          ) : (
            <p className="text-[16px] text-gray-600 py-6">
              No comments yet! Add one to start the conversation.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CommentOwner = ({ commenterId }) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [commenter, setCommenter] = useState<User | null>(null);
  const getCommentOwner = useCallback(async () => {
    try {
      setLoading(true);
      const user = await GetTargetUser(commenterId);
      setCommenter(user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [commenterId]);

  useEffect(() => {
    if (logInUser?._id !== commenterId && commenterId) getCommentOwner();
  }, [getCommentOwner, logInUser?._id, commenterId]);
  return (
    <>
      <img
        src={commenter?.avatar || logInUser?.avatar}
        alt={commenter?.username || logInUser?.username}
        className="w-8 h-8 rounded-full object-contain"
      />
      <span>{commenter?.username || logInUser?.username}</span>
    </>
  );
};

export default CommentsOfPost;
