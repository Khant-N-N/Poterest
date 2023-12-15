import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import love from "../../assets/reacts/heart.png";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { PiHeartStraightBold } from "react-icons/pi";
import { FaCircleUser } from "react-icons/fa6";
interface comment {
  id: string;
  commenterId?: string;
  comment?: string;
  createdAt?: string;
  likes: string[];
}
const CommentData = ({ comment, commenterId, createdAt, likes }: comment) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [commenter, setCommenter] = useState<User | null>(null);
  const [timeStamp, setTimeStamp] = useState({
    timeDifferenceInSeconds: 0,
    timeDifferenceInMinutes: 0,
    timeDifferenceInHours: 0,
    timeDifferenceInDays: 0,
  });

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
      <div className="flex text-[16px] w-full">
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
        <>
          <textarea
            autoFocus
            placeholder="Reply"
            className="bg-transparent border-2 outline-none px-4 pt-2 pb-6 rounded-3xl h-[5rem] w-full xs:w-4/5"
          />
          <p className="flex w-4/5 justify-end gap-4">
            <button type="button" onClick={() => setIsReply(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => setIsReply(false)}>
              Save
            </button>
          </p>
        </>
      )}
    </>
  );
};

export default CommentData;
