import React from "react";
import { LuPenSquare } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../app/store";
// import io from "socket.io-client";
// import { ChatBox } from "../models/chat.model";

const MessageInbox = () => {
  // const { logInUser } = useSelector((state: RootState) => state.user);
  const [isType, setIsType] = useState(false);
  // const [chat, setChat] = useState<ChatBox | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // useEffect(() => {
  //   const socket = io("/chat");
  //   socket.on("welcome", (data) => {
  //     console.log(data.Message);
  //   });

  //   socket.on("chatUpdate", (updateChat) => {
  //     setChat(updateChat);
  //   });
  //   console.log("connects");
  //   return () => {
  //     console.log("disconnects");
  //     socket.disconnect();
  //   };
  // }, []);
  return (
    <div className="flex flex-col items-center gap-4 min-h-screen mt-8 md:mt-24 relative">
      <div className="relative">
        {!isType && (
          <FaSearch className="absolute left-4 top-5 text-gray-500" />
        )}
        {isType && (
          <FaXmark
            onClick={() => {
              setIsType(false);
              setSearchValue("");
            }}
            className="absolute right-4 top-[1.2rem] rounded-full cursor-pointer text-[25px] hover:bg-[var(--sec-light)]"
          />
        )}
        <input
          onClick={() => setIsType(true)}
          onChange={handleChange}
          value={searchValue}
          type="text"
          id="searchBox"
          placeholder={`${!isType ? "    " : ""} Search by name or email`}
          className="font-normal py-4 px-5 rounded-full bg-[#e1e1e1] md:w-[20rem] lg:w-[30rem] xl:w-[40rem] focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="flex items-center gap-3 font-medium w-full md:w-[20rem] lg:w-[30rem] xl:w-[40rem] cursor-pointer hover:bg-[var(--sec-light)] p-2 rounded-lg">
        <div className="p-2 bg-[var(--pri-red)] text-[1.3rem] text-white rounded-full">
          <LuPenSquare />
        </div>
        <p>New Message</p>
      </div>
    </div>
  );
};

export default MessageInbox;
