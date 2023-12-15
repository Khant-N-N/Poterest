import axios from "axios";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Comment, Post } from "../../models/post.model";
import { GetCommentsOfPost } from "../../networks/post.api";
import Loader from "../Loader";
import CommentData from "./CommentData";

interface CommentProps {
  postData: Post;
}

const CommentsOfPost = ({ postData }: CommentProps) => {
  const [seeComment, setSeeComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const commentsData = await GetCommentsOfPost(id);
      setComments(commentsData);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        setError("Error getting Comments, please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="mx-5 my-8">
      <p
        onClick={() => {
          setSeeComment(!seeComment);
          fetchComments(postData._id);
        }}
        className="font-semibold cursor-pointer px-2 hover:border-4 rounded-2xl flex justify-between items-center"
      >
        Comments <FaChevronDown />
      </p>
      {seeComment && (
        <div className="flex flex-col gap-7 py-5">
          {error && <p className="text-center text-red-500">{error}</p>}
          {loading && (
            <div className="flex w-full h-full items-center justify-center">
              <Loader />
            </div>
          )}
          {comments.length && !loading && !error
            ? comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex flex-col xs:px-5 items-end"
                >
                  <CommentBox commentData={comment} />
                </div>
              ))
            : !loading &&
              !error && (
                <p className="text-[16px] mx-5 md:mx-9 text-gray-600 py-6">
                  No comments yet! Add one to start the conversation.
                </p>
              )}
        </div>
      )}
    </div>
  );
};

const CommentBox = ({ commentData }: { commentData: Comment }) => {
  const { _id, comment, commenterId, createdAt, likes, replies } = commentData;
  const [seeReply, setSeeReply] = useState(false);

  return (
    <>
      <CommentData
        id={_id}
        comment={comment}
        commenterId={commenterId}
        createdAt={createdAt}
        likes={likes}
      />
      <div className="w-full ps-14 text-[16px]">
        {replies?.length > 0 && (
          <p
            className="my-4 cursor-pointer select-none active:border-2 rounded-xl"
            onClick={() => setSeeReply(!seeReply)}
          >
            {seeReply
              ? "---- Hide reply"
              : `---- View ${replies?.length} ${
                  replies?.length === 1 ? "reply" : "replies"
                }`}
          </p>
        )}
        {replies?.length > 0 &&
          seeReply &&
          replies?.map((reply) => (
            <CommentData
              key={reply._id}
              id={reply._id}
              comment={reply.reply}
              commenterId={reply.replierId}
              createdAt={reply.replyAt}
              likes={reply.likes}
            />
          ))}
      </div>
    </>
  );
};

export default CommentsOfPost;
