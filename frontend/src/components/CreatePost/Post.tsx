import React, { useState, useEffect } from "react";
import { Post } from "../../models/post.model";
import { BiDotsVerticalRounded } from "react-icons/bi";

interface PostProps {
  post: Post;
}
const Post = ({ post }: PostProps) => {
  return (
    <div className={`overflow-hidden mb-5`}>
      <img
        id="image"
        src={post.imgUrl}
        alt={post.caption}
        className="w-full h-auto rounded-lg md:rounded-2xl object-contain block cursor-zoom-in"
      />
      <div className="flex justify-between items-center w-full text-[14px] md:text-[16px] tracking-normal ps-2">
        {post.caption}
        <BiDotsVerticalRounded className="text-[19px] cursor-pointer" />
      </div>
    </div>
  );
};

export default Post;
