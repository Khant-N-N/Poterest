import { MdDownload } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { HiShare } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IdProps {
  userId: string;
  onClick?: (boolean: boolean) => void;
  postId: string;
}

const HoverFunc = ({ userId, postId }: IdProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  return (
    <div className="absolute transition-opacity opacity-0 hover:opacity-100 cursor-zoom-in bg-black/60 p-2 flex flex-col items-end justify-between w-full h-full">
      <button className="p-3 rounded-3xl text-white bg-[var(--pri-red)] hover:bg-[var(--sec-red)]">
        Save
      </button>
      <div className="flex gap-3">
        {logInUser?._id === userId && (
          <div
            onClick={() => navigate(`/edit-post/${postId}`)}
            className="bg-[var(--light)] cursor-pointer p-2 rounded-full opacity-70 hover:opacity-100"
          >
            <FaPen />
          </div>
        )}
        <div className="bg-[var(--light)] cursor-pointer p-2 rounded-full opacity-70 hover:opacity-100">
          <MdDownload />
        </div>
      </div>
    </div>
  );
};

const ClickFunc = ({ userId, onClick, postId }: IdProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
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

  return (
    <div
      ref={showMenuRef}
      className="absolute bg-white rounded-md px-1 flex bottom-1 right-5 flex-col"
    >
      <button className="p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
        <FaRegHeart /> Save
      </button>
      {logInUser?._id === userId && (
        <div
          onClick={() => navigate(`/edit-post/${postId}`)}
          className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100"
        >
          <FaPen /> Edit
        </div>
      )}
      <div className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
        <MdDownload /> Download
      </div>
      <div className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
        <HiShare /> Share
      </div>
    </div>
  );
};

export { HoverFunc, ClickFunc };
