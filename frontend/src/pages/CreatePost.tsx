import React, { useState, useRef } from "react";
import { FaArrowUpFromBracket, FaChevronDown } from "react-icons/fa6";
import { TbExchange } from "react-icons/tb";
import "../styles/checkbox.css";
import TagTopics from "../components/CreatePost/TagTopics";

interface IntialCreateFormType {
  imgUrl: string;
  caption: string;
  description: string;
  topic: string[];
  allowComment: boolean;
}

const intialCreateForm: IntialCreateFormType = {
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
  console.log(createForm);

  const uploadRef = useRef<HTMLInputElement>(null);
  const handleChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const read = new FileReader();
      read.onload = () => {
        setSelectedImg(read.result as string);
      };
      read.readAsDataURL(file);
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
          <form className="w-full md:w-1/2 mt-12 px-6">
            <div className="border-b border-black mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name=""
                id="title"
                className="border-none outline-none block px-3 py-5 w-full bg-transparent caret-[var(--pri-red)]"
                placeholder="Tell everyone what your post is about"
              />
            </div>
            <div className="border-b border-black mb-3">
              <label htmlFor="title">Description</label>
              <input
                type="text"
                name=""
                id="description"
                className="border-none outline-none block px-3 py-5 w-full bg-transparent caret-[var(--pri-red)]"
                placeholder="Add a description to your post"
              />
            </div>
            <TagTopics />
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
            <div className="flex items-center justify-end gap-3 px-4 my-6">
              <button
                onClick={() => setSelectedImg(null)}
                type="button"
                className="py-3 px-5 rounded-full bg-[var(--sec-light)] hover:bg-gray-300 self-end"
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-3 px-5 rounded-full bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white self-end"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
