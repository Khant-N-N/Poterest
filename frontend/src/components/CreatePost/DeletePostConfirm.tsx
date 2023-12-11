import React, { useState } from "react";
import { DeletePost } from "../../networks/post.api";
import axios from "axios";
import { deletePost } from "../../features/postSlice";
import { useDispatch } from "react-redux";

interface DeleteProps {
  onDisplay: (boolean: boolean) => void;
  isDisplay: boolean;
  text: string;
  postId: string;
  onDelete: (id: string) => void;
}
const DeletePostConfirm = ({
  onDisplay,
  isDisplay,
  text,
  postId,
}: DeleteProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    try {
      setError(null);
      setLoading(true);

      await DeletePost(postId);

      onDisplay(false);
      dispatch(deletePost(postId));
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        isDisplay ? "scale-100" : "scale-0"
      } h-full w-full absolute top-0 transition-all z-40 flex flex-col justify-center items-center text-[14px]`}
    >
      <div
        onClick={() => {
          onDisplay(false);
          setError(null);
        }}
        className="absolute h-full w-full z-10"
      />
      <div className="w-[90%] bg-[var(--sec-light)] gap-5 shadow-lg z-20 px-4 py-6 rounded-md flex flex-col justify-center items-center">
        <p className="text-center">Please Confirm to {text} this post</p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => {
              onDisplay(false);
              setError(null);
            }}
            className="hover:bg-gray-300 bg-gray-400 py-3 px-3 md:px-5 rounded-full"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleConfirm}
            type="button"
            className="bg-[var(--pri-red)] disabled:opacity-40 text-white hover:bg-[var(--sec-red)] py-3 px-3 md:px-5 rounded-full"
          >
            {loading ? "Deleting" : text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostConfirm;
