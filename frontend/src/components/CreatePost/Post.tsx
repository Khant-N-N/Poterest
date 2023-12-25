import { useCallback, useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import { ClickFunc, HoverFunc } from "../PostFunctions";
import DeletePostConfirm from "./DeletePostConfirm";
import {
  savedUserData,
  setPostId,
  showPostDetail,
} from "../../features/postSlice";

interface PostProps {
  post: Post;
}

const Post = ({ post }: PostProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const { savedUsers } = useSelector((state: RootState) => state.post);
  const [postOwner, setPostOwner] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  const getPostOwner = useCallback(async () => {
    try {
      setProfileLoading(true);
      const existingUser = savedUsers.find(
        (user) => user._id === post.uploaderId
      );

      if (!existingUser) {
        const user = await GetTargetUser(post.uploaderId);

        dispatch(savedUserData(user));
        setPostOwner(user);
      } else {
        setPostOwner(existingUser);
      }

      setProfileLoading(false);
    } catch (error) {
      console.log(error);
      setProfileLoading(false);
    }
  }, [post.uploaderId, dispatch, savedUsers]);

  useEffect(() => {
    if (logInUser?._id !== post.uploaderId) {
      getPostOwner();
    }
  }, [logInUser?._id, post.uploaderId]);
  return (
    <div className={`mb-7 relative`}>
      <DeletePostConfirm
        onDisplay={(boolean) => setConfirmDelete(boolean)}
        isDisplay={confirmDelete}
        text="delete"
        postId={post._id}
      />
      <div className="relative overflow-hidden rounded-lg md:rounded-2xl">
        <HoverFunc post={post} deletePost={() => setConfirmDelete(true)} />
        <img
          onClick={() => {
            dispatch(showPostDetail(true));
            dispatch(setPostId(post._id));
          }}
          id="image"
          loading="lazy"
          src={post.imgUrl}
          alt={post.caption}
          className="w-full h-auto rounded-lg md:rounded-2xl object-contain block"
        />
      </div>
      <div className="flex relative justify-between items-center mt-1 md:mt-3 w-full text-[14px] md:text-[16px] tracking-normal ps-2">
        {profileLoading ? (
          <FaCircleUser className="text-[20px]" />
        ) : (
          <Link
            to={
              logInUser?._id === post.uploaderId
                ? "/profile"
                : `/profile/${post.uploaderId}`
            }
            className="flex gap-2 items-center cursor-pointer hover:underline"
          >
            <img
              src={postOwner?.avatar || logInUser?.avatar}
              alt="owner"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{postOwner?.username || logInUser?.username}</span>
          </Link>
        )}
        {isShowMenu && (
          <ClickFunc
            onClick={() => setIsShowMenu(false)}
            post={post}
            deletePost={() => setConfirmDelete(true)}
          />
        )}
        <BiDotsVerticalRounded
          onClick={() => setIsShowMenu(!isShowMenu)}
          className="cursor-pointer text-[20px]"
        />
      </div>
    </div>
  );
};

export default Post;
