import { useState } from "react";
import { CreatedPosts } from "./CreatedPosts";
import SavedPosts from "./SavedPosts";

const ProfilePosts = () => {
  const [isCreated, setIsCreated] = useState(true);
  return (
    <div className="mt-14 flex flex-col items-center">
      <div className="flex gap-12 md:text-[23px]">
        <p
          onClick={() => setIsCreated(true)}
          className={`${
            isCreated
              ? "border-b-4 border-black rounded px-3 pb-3 cursor-pointer"
              : " cursor-pointer"
          }`}
        >
          Created
        </p>
        <p
          onClick={() => setIsCreated(false)}
          className={`${
            isCreated
              ? " cursor-pointer"
              : "border-b-4 border-black rounded px-3 pb-3 cursor-pointer"
          }`}
        >
          Saved
        </p>
      </div>

      {isCreated ? <CreatedPosts /> : <SavedPosts />}
    </div>
  );
};

export default ProfilePosts;
