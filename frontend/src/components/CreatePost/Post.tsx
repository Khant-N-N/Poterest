import React, { useState, useEffect, useCallback } from "react";
import { Post } from "../../models/post.model";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface PostProps {
  post: Post;
}
const Post = ({ post }: PostProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [postOwner, setPostOwner] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const getPostOwner = useCallback(async () => {
    try {
      setProfileLoading(true);
      const user = await GetTargetUser(post.uploaderId);
      setPostOwner(user);
      setProfileLoading(false);
    } catch (error) {
      console.log(error);
      setProfileLoading(false);
    }
  }, [post.uploaderId]);

  useEffect(() => {
    if (logInUser?._id !== post.uploaderId) getPostOwner();
  }, [getPostOwner, logInUser?._id, post.uploaderId]);
  return (
    <div className={`overflow-hidden mb-7`}>
      <img
        id="image"
        loading="lazy"
        src={post.imgUrl}
        alt={post.caption}
        className="w-full h-auto rounded-lg md:rounded-2xl object-contain block cursor-zoom-in"
      />
      <div className="flex justify-between items-center mt-1 md:mt-3 w-full text-[14px] md:text-[16px] tracking-normal ps-2">
        {profileLoading ? (
          <FaCircleUser className="text-[20px]" />
        ) : (
          <div className="flex gap-2 items-center">
            <img
              src={postOwner?.avatar || logInUser?.avatar}
              alt="owner"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{postOwner?.username || logInUser?.username}</span>
          </div>
        )}
        <BiDotsVerticalRounded className="cursor-pointer text-[20px]" />
      </div>
    </div>
  );
};

export default Post;
