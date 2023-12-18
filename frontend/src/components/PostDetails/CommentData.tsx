import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import love from "../../assets/reacts/heart.png";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { PiHeartStraightBold } from "react-icons/pi";
import { FaCircleUser } from "react-icons/fa6";
import { ReplyToComment } from "../../networks/post.api";
import { updateReplyComment } from "../../features/postSlice";
interface comment {
  id: string;
  commenterId?: string;
  comment?: string;
  createdAt?: string;
  likes: string[];
  onReply: (bool: boolean) => void;
}
const CommentData = ({
  id,
  comment,
  commenterId,
  createdAt,
  likes,
  onReply,
}: comment) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const { postId } = useSelector((state: RootState) => state.post);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [commenter, setCommenter] = useState<User | null>(null);
  const [timeStamp, setTimeStamp] = useState({
    timeDifferenceInSeconds: 0,
    timeDifferenceInMinutes: 0,
    timeDifferenceInHours: 0,
    timeDifferenceInDays: 0,
  });

  const dispatch = useDispatch();

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (replyText === "") return;
    if (!logInUser?._id) return;
    if (!postId) return;
    try {
      setReplyLoading(true);
      const reply = {
        replierId: logInUser?._id,
        reply: replyText,
      };
      const data = await ReplyToComment(postId, id, reply);
      dispatch(updateReplyComment(data));
      setReplyText("");
      setReplyLoading(false);
      setIsReply(false);
      onReply(true);
    } catch (error) {
      console.log(error);
      setReplyLoading(false);
    }
  };

  const getCommentOwner = useCallback(async () => {
    try {
      setLoading(true);
      const user = await GetTargetUser(commenterId!);
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

  const calculateTime = useCallback(() => {
    const currentTime = new Date().getTime();
    const commmentTime = new Date(createdAt!).getTime();

    const timeDiff = currentTime - commmentTime;
    setTimeStamp({
      timeDifferenceInSeconds: Math.round(timeDiff / 1000),
      timeDifferenceInMinutes: Math.round(timeDiff / (1000 * 60)),
      timeDifferenceInHours: Math.round(timeDiff / (1000 * 60 * 60)),
      timeDifferenceInDays: Math.round(timeDiff / (1000 * 60 * 60 * 24)),
    });
  }, [createdAt]);
  useEffect(() => {
    calculateTime();
  }, [calculateTime]);
  let CommentedTime = timeStamp.timeDifferenceInSeconds + "s";
  if (timeStamp.timeDifferenceInSeconds > 60)
    CommentedTime = timeStamp.timeDifferenceInMinutes + "m";
  if (timeStamp.timeDifferenceInMinutes > 60)
    CommentedTime = timeStamp.timeDifferenceInHours + "h";
  if (timeStamp.timeDifferenceInHours > 24)
    CommentedTime = timeStamp.timeDifferenceInDays + "d";
  return (
    <>
      <div className="flex text-[16px] w-full mb-2">
        {loading ? (
          <FaCircleUser className="text-[30px] me-3" />
        ) : (
          <img
            loading="lazy"
            src={commenter?.avatar || logInUser?.avatar}
            alt={commenter?.username || logInUser?.username}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
        )}
        <div className="flex flex-wrap">
          <p>
            {!loading && (
              <span className="font-medium mr-3 xs:text-[18px]">
                {commenter?.username || logInUser?.username}
              </span>
            )}
            {comment}
          </p>
          <div className="w-full text-[15px] flex gap-4 mt-2 items-center">
            <p className="text-gray-600">{CommentedTime}</p>
            <button type="button" onClick={() => setIsReply(true)}>
              Reply
            </button>
            {isLiked ? (
              <div className="flex items-center gap-2">
                {likes?.length > 0 && likes?.length}
                <img
                  onClick={() => setIsLiked(!isLiked)}
                  src={love}
                  alt="liked"
                  className="w-5 h-5 select-none rounded-full object-cover cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {likes?.length > 0 && likes?.length}
                <PiHeartStraightBold
                  onClick={() => setIsLiked(!isLiked)}
                  className="cursor-pointer select-none"
                />
              </div>
            )}
            <BiDotsVerticalRounded className="cursor-pointer text-[26px] rotate-90 hover:bg-[var(--sec-light)] rounded-full" />
          </div>
        </div>
      </div>
      {isReply && (
        <form onSubmit={handleReply} className="w-full flex flex-col items-end">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
            placeholder="Reply"
            className="bg-transparent border-2 outline-none px-4 pt-2 pb-6 rounded-3xl h-[5rem] w-full xs:w-4/5"
          />
          <p className="flex w-4/5 justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={() => setIsReply(false)}
              className="py-2 px-3 rounded-3xl bg-[var(--sec-light)] hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              disabled={replyLoading}
              type="submit"
              className="py-2 px-3 rounded-3xl bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white disabled:opacity-60"
            >
              Send
            </button>
          </p>
        </form>
      )}
    </>
  );
};

export default CommentData;
