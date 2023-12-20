import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaPen, FaRegHeart, FaTrash } from "react-icons/fa6";
import { HiShare } from "react-icons/hi";
import { MdDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { setPostId, showPostDetail } from "../features/postSlice";
import { getAuthenticatedUser } from "../features/userSlice";
import { Post } from "../models/post.model";
import { AddSavedPost, RemoveSavedPost } from "../networks/post.api";

interface IdProps {
  post: Post;
  onClick?: (boolean: boolean) => void;
  deletePost: (boolean: boolean) => void;
}

const HoverFunc = ({ post, deletePost }: IdProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (logInUser)
      setIsSaved(
        logInUser.saved?.some((savedPost) => savedPost._id === post._id)
      );
  }, [logInUser, post._id]);

  const handleSavePost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      setSaveLoading(true);
      setSaveError(null);
      const data = await AddSavedPost(post);
      dispatch(getAuthenticatedUser(data));
      setIsSaved(true);
      setSaveLoading(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setSaveError(error.response?.data.error);
      }
    }
  };
  const handleRemoveSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      setSaveLoading(true);
      setSaveError(null);
      const data = await RemoveSavedPost(post._id);
      dispatch(getAuthenticatedUser(data));
      setIsSaved(false);
      setSaveLoading(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setSaveError(error.response?.data.error);
      }
    }
  };

  return (
    <div className="absolute group transition-opacity opacity-0 hover:opacity-100 text-[11px] xs:text-[18px] cursor-zoom-in bg-black/60 p-2 hidden md:flex flex-col items-end justify-between w-full h-full">
      <div
        onClick={() => {
          dispatch(showPostDetail(true));
          dispatch(setPostId(post._id));
        }}
        className="absolute w-full h-full z-10"
      />
      <button
        disabled={saveLoading}
        onClick={isSaved ? handleRemoveSave : handleSavePost}
        className="p-1 text-[12px] md:text-[18px] xs:p-3 hidden group-hover:block rounded-3xl text-white bg-[var(--pri-red)] hover:bg-[var(--sec-red)] disabled:opacity-50 z-20"
      >
        {isSaved ? "UnSaved" : "Save"}
      </button>
      <div className="hidden gap-3 group-hover:flex justify-between w-full">
        {logInUser?._id === post.uploaderId && (
          <div className="flex gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-post/${post._id}`);
              }}
              className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100 z-20"
            >
              <FaPen />
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                deletePost(true);
              }}
              className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100 z-20"
            >
              <FaTrash />
            </div>
          </div>
        )}
        <a
          onClick={(e) => e.stopPropagation()}
          download
          href={post.imgUrl}
          target="_blank"
          className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100 z-20"
        >
          <MdDownload />
        </a>
      </div>
    </div>
  );
};

const ClickFunc = ({ onClick, post, deletePost }: IdProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const showMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (showMenuRef.current && !showMenuRef.current.contains(target)) {
        onClick && onClick(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (logInUser)
      setIsSaved(
        logInUser.saved.some((savedPost) => savedPost._id === post._id)
      );
  }, [logInUser, post._id]);

  const handleSavePost = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      const data = await AddSavedPost(post);
      dispatch(getAuthenticatedUser(data));
      setIsSaved(true);
      setSaveLoading(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setSaveError(error.response?.data.error);
      }
    }
  };
  const handleRemoveSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      const data = await RemoveSavedPost(post._id);
      dispatch(getAuthenticatedUser(data));
      setIsSaved(false);
      setSaveLoading(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setSaveError(error.response?.data.error);
      }
    }
  };

  return (
    <div
      ref={showMenuRef}
      className="absolute bg-white rounded-md px-1 flex bottom-1 right-1 flex-col h-[130px] md:h-auto overflow-y-scroll z-10"
    >
      <button
        onClick={isSaved ? handleRemoveSave : handleSavePost}
        disabled={saveLoading}
        className="p-2 flex gap-2 items-center opacity-70 hover:opacity-100 text-[var(--pri-red)]"
      >
        {saveLoading && isSaved && "Unsaving"}
        {saveLoading && !isSaved && "Saving"}
        {!saveLoading && isSaved && (
          <>
            <FaHeart /> Unsave
          </>
        )}
        {!saveLoading && !isSaved && (
          <>
            <FaRegHeart /> Save
          </>
        )}
      </button>
      {logInUser?._id === post.uploaderId && (
        <>
          <div
            onClick={() => {
              navigate(`/edit-post/${post._id}`);
              dispatch(showPostDetail(false));
            }}
            className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100"
          >
            <FaPen /> Edit
          </div>
          <div
            onClick={() => deletePost(true)}
            className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100"
          >
            <FaTrash /> Delete
          </div>
        </>
      )}
      <a
        download
        href={post.imgUrl}
        target="_blank"
        className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100"
      >
        <MdDownload /> Download
      </a>
      <div className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
        <HiShare /> Share
      </div>
    </div>
  );
};

export { ClickFunc, HoverFunc };
