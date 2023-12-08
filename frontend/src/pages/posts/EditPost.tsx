import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Post } from "../../models/post.model";
import TagTopics from "../../components/CreatePost/TagTopics";
import "../../styles/checkbox.css";
import { EditMyPost } from "../../networks/post.api";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const [editPost, setEditPost] = useState<Post | null | undefined>(null);
  const { createdPosts } = useSelector((state: RootState) => state.post);
  const [editForm, setEditForm] = useState({
    caption: editPost?.caption,
    description: editPost?.description,
    topic: editPost?.topic,
    allowComment: editPost?.allowComment,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(
    () => setEditPost(createdPosts?.filter((post) => post._id === id)[0]),
    [id, createdPosts]
  );
  useEffect(
    () =>
      setEditForm({
        caption: editPost?.caption,
        description: editPost?.description,
        topic: editPost?.topic,
        allowComment: editPost?.allowComment,
      }),
    [editPost]
  );

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await EditMyPost({ editForm, id });
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleEdit}
      className="mt-10 md:mt-24 mb-28 max-w-[700px] mx-auto px-3"
    >
      <img
        src={editPost?.imgUrl}
        alt={editPost?.caption}
        className="w-[300px] object-contain h-auto mx-auto rounded-lg mb-3"
      />
      <div className="border-b border-black mb-3">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          defaultValue={editForm?.caption}
          onChange={(e) =>
            setEditForm({ ...editForm, caption: e.target.value })
          }
          className="border-none outline-none block px-3 py-5 w-full bg-transparent caret-[var(--pri-red)]"
          placeholder="Tell everyone what your post is about"
        />
      </div>
      <div className="border-b border-black mb-3">
        <label htmlFor="title">Description</label>
        <input
          type="text"
          id="description"
          defaultValue={editForm?.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          className="border-none outline-none block px-3 py-5 w-full bg-transparent caret-[var(--pri-red)]"
          placeholder="Add a description to your post"
        />
      </div>
      <TagTopics
        autoSelectTopic={editForm.topic}
        setTopic={(topic) => setEditForm({ ...editForm, topic: topic })}
      />
      <div className="flex items-center gap-5 my-4">
        <label className="switch">
          <input
            type="checkbox"
            checked={editForm.allowComment}
            onChange={() =>
              setEditForm({
                ...editForm,
                allowComment: !editForm.allowComment,
              })
            }
          />
          <span className="slider" />
        </label>
        <span>Allow comments</span>
      </div>
      {error && <p className="text-center text-red-500 text-[17px]">{error}</p>}
      <div className="flex items-center justify-end gap-3 px-4 my-6">
        <Link
          className="py-3 px-5 rounded-full bg-[var(--sec-light)] hover:bg-gray-300 self-end"
          to="/profile"
        >
          Cancel
        </Link>
        <button
          disabled={
            loading ||
            (editForm?.caption === editPost?.caption &&
              editForm?.description === editPost?.description &&
              editForm?.topic === editPost?.topic &&
              editForm?.allowComment === editPost?.allowComment)
          }
          className="py-3 px-5 rounded-full bg-[var(--pri-red)] hover:bg-[var(--sec-red)] disabled:opacity-50 text-white self-end"
        >
          {loading ? "Saving " : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditPost;
