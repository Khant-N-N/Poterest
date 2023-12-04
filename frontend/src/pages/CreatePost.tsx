import React, { useState, useRef } from "react";
import { FaArrowUpFromBracket, FaChevronDown } from "react-icons/fa6";
import { TbExchange } from "react-icons/tb";
import "../styles/checkbox.css";
import TagTopics from "../components/CreatePost/TagTopics";
import { CreateAPost, IntialCreateFormProp } from "../networks/post.api";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const intialCreateForm: IntialCreateFormProp = {
  imgUrl: "",
  caption: "",
  description: "",
  topic: [],
  allowComment: true,
};

const CreatePost = () => {
  const [createForm, setCreateForm] = useState(intialCreateForm);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [moreOptions, setMoreOptions] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const uploadRef = useRef<HTMLInputElement>(null);
  const handleChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file && setUploadFile(file);
    if (file) {
      const read = new FileReader();
      read.onload = () => {
        setSelectedImg(read.result as string);
      };
      read.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setError(error.message);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const updatedForm = { ...createForm, imgUrl: downloadUrl };
          setCreateForm(updatedForm);

          await CreateAPost(updatedForm);
          setLoading(false);
          navigate("/profile");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setError(error.response?.data.error);
          } else {
            setError("Something went wrong, please try again.");
          }
          setLoading(false);
        }
      }
    );
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      uploadFile && (await handleImageUpload(uploadFile));
    } catch (error) {
      console.error("Error during image upload:", error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="mt-24 mb-16">
      <input
        ref={uploadRef}
        type="file"
        name="postFile"
        id="postFile"
        hidden
        accept="image/*"
        onChange={handleChangeUpload}
      />
      {!selectedImg && (
        <div
          onClick={() => uploadRef.current?.click()}
          className="w-[250px] md:w-[300px] h-[400px] md:h-[500px] px-4 cursor-pointer border-4 border-dotted border-black/50 bg-[var(--sec-light)] rounded-xl mx-auto flex flex-col justify-center items-center"
        >
          <FaArrowUpFromBracket />
          <p className="text-center">Choose a file</p>
          <p className="text-gray-400 text-center">
            Recommend to use quality files less than 10MB
          </p>
        </div>
      )}
      {selectedImg && (
        <div className="flex flex-col md:flex-row justify-center md:gap-12 items-center">
          <div className="relative w-3/5 md:w-[300px] lg:w-[500px] overflow-hidden rounded-2xl">
            <div
              onClick={() => uploadRef.current?.click()}
              className="absolute cursor-pointer text-[1.4rem] right-2 top-2 p-3 bg-[var(--sec-light)] rounded-full"
            >
              <TbExchange />
            </div>
            <img
              src={selectedImg}
              alt="uploadImg"
              className="w-full h-auto object-contain"
            />
          </div>
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 mt-12 px-6">
            <div className="border-b border-black mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                onChange={(e) =>
                  setCreateForm({ ...createForm, caption: e.target.value })
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
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                className="border-none outline-none block px-3 py-5 w-full bg-transparent caret-[var(--pri-red)]"
                placeholder="Add a description to your post"
              />
            </div>
            <TagTopics
              setTopic={(topic) =>
                setCreateForm({ ...createForm, topic: topic })
              }
            />
            <div className="border-b border-black mb-3">
              <div
                onClick={() => setMoreOptions(!moreOptions)}
                className=" cursor-pointer py-3 gap-3 flex items-center"
              >
                More Options <FaChevronDown />
              </div>
              {moreOptions && (
                <div className="flex items-center gap-5 my-4">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={createForm.allowComment}
                      onChange={() =>
                        setCreateForm({
                          ...createForm,
                          allowComment: !createForm.allowComment,
                        })
                      }
                    />
                    <span className="slider" />
                  </label>
                  <span>Allow comments</span>
                </div>
              )}
            </div>
            {error && (
              <p className="text-center text-red-500 text-[17px]">{error}</p>
            )}
            <div className="flex items-center justify-end gap-3 px-4 my-6">
              <button
                onClick={() => setSelectedImg(null)}
                type="button"
                className="py-3 px-5 rounded-full bg-[var(--sec-light)] hover:bg-gray-300 self-end"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className="py-3 px-5 rounded-full bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white self-end"
              >
                {loading ? "Creating" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
