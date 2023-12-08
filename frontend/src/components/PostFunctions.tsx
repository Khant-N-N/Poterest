import { MdDownload } from "react-icons/md";
import { FaPen, FaTrash } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { HiShare } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

interface IdProps {
  userId: string;
  onClick?: (boolean: boolean) => void;
  postId: string;
  imgUrl: string;
}

const HoverFunc = ({ userId, postId, imgUrl }: IdProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleDownload = () => {
    saveAs(imgUrl, `poterest-${postId}.jpg`);
  };

  return (
    <div className="absolute group transition-opacity opacity-0 hover:opacity-100 text-[11px] xs:text-[18px] cursor-zoom-in bg-black/60 p-2 hidden md:flex flex-col items-end justify-between w-full h-full">
      <button className="p-1 text-[12px] md:text-[18px] xs:p-3 hidden group-hover:block rounded-3xl text-white bg-[var(--pri-red)] hover:bg-[var(--sec-red)]">
        Save
      </button>
      <div className="hidden gap-3 group-hover:flex justify-between w-full">
        {logInUser?._id === userId && (
          <div className="flex gap-3">
            <div
              onClick={() => navigate(`/edit-post/${postId}`)}
              className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100"
            >
              <FaPen />
            </div>
            <div
              onClick={() => navigate(`/edit-post/${postId}`)}
              className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100"
            >
              <FaTrash />
            </div>
          </div>
        )}
        <a
          download
          href={imgUrl}
          target="_blank"
          className="bg-[var(--light)] cursor-pointer p-1 xs:p-2 rounded-full opacity-70 hover:opacity-100"
        >
          <MdDownload />
        </a>
      </div>
    </div>
  );
};

const ClickFunc = ({ userId, onClick, postId, imgUrl }: IdProps) => {
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
      className="absolute bg-white rounded-md px-1 flex bottom-1 right-1 flex-col"
    >
      <button className="p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
        <FaRegHeart /> Save
      </button>
      {logInUser?._id === userId && (
        <>
          <div
            onClick={() => navigate(`/edit-post/${postId}`)}
            className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100"
          >
            <FaPen /> Edit
          </div>
          <div className="cursor-pointer p-2 flex gap-2 items-center opacity-70 hover:opacity-100">
            <FaTrash /> Delete
          </div>
        </>
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
