import React, { useState } from "react";
import good_idea from "../../assets/reacts/good idea.png";
import { PiHeartStraightBold } from "react-icons/pi";
import haha from "../../assets/reacts/haha.png";
import love from "../../assets/reacts/heart.png";
import thanks from "../../assets/reacts/thanks.png";
import wow from "../../assets/reacts/wow.png";
import { Post } from "../../models/post.model";

enum reactions {
  good_idea = "good_idea",
  haha = "haha",
  love = "love",
  thanks = "thanks",
  wow = "wow",
}

const reactionImage = {
  [reactions.good_idea]: good_idea,
  [reactions.wow]: wow,
  [reactions.love]: love,
  [reactions.thanks]: thanks,
  [reactions.haha]: haha,
};

interface ReactionsProps {
  postData: Post;
}

const Reacts = ({ postData }: ReactionsProps) => {
  const [currentReact, setCurrentReact] = useState<reactions | null>(null);

  const giveReaction = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (e.target instanceof HTMLImageElement) {
      const reactionId = e.target.id as reactions;
      setCurrentReact((prev) => (prev === reactionId ? null : reactionId));
    }
  };

  return (
    <div className="flex  gap-3 items-center">
      <div>2</div>
      <div className="group">
        <div className="hidden group-hover:flex md:group-hover:-top-20 gap-3 bg-[var(--light)] shadow-2xl p-3 rounded-full absolute z-30 right-0 -top-14">
          <div className="flex flex-col items-center">
            <img
              onClick={giveReaction}
              title="love"
              id="love"
              src={love}
              alt="love react"
              className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
            />
            <span className="text-[13px]">Love</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              onClick={giveReaction}
              title="good idea"
              id="good_idea"
              src={good_idea}
              alt="good react"
              className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
            />
            <span className="text-[13px]">Good idea</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              onClick={giveReaction}
              title="thanks"
              id="thanks"
              src={thanks}
              alt="thanks react"
              className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
            />
            <span className="text-[13px]">Thanks</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              onClick={giveReaction}
              title="wow"
              id="wow"
              src={wow}
              alt="wow react"
              className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
            />
            <span className="text-[13px]">Wow</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              onClick={giveReaction}
              title="haha"
              id="haha"
              src={haha}
              alt="haha react"
              className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
            />
            <span className="text-[13px]">Haha</span>
          </div>
        </div>
        <div
          onClick={() => {
            currentReact
              ? setCurrentReact(null)
              : setCurrentReact(reactions.love);
          }}
          className="p-3 bg-[var(--sec-light)] select-none rounded-full cursor-pointer text-[25px]"
        >
          {currentReact ? (
            <img
              title="haha"
              id="haha"
              src={reactionImage[currentReact]}
              alt="haha react"
              className="w-7 h-7 hover:scale-[1.3] cursor-pointer transition-transform"
            />
          ) : (
            <PiHeartStraightBold />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reacts;
