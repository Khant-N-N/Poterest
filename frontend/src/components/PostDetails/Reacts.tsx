import React, { useEffect, useRef, useState } from "react";
import { PiHeartStraightBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import good_idea from "../../assets/reacts/good idea.png";
import haha from "../../assets/reacts/haha.png";
import love from "../../assets/reacts/heart.png";
import thanks from "../../assets/reacts/thanks.png";
import wow from "../../assets/reacts/wow.png";
import { Reaction } from "../../models/post.model";
import { AddRemoveReactionToPost } from "../../networks/post.api";
import ReactsFilter from "./ReactsFilter";

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
  postId: string;
  Reacts: Reaction[];
}

const Reacts = ({ postId, Reacts }: ReactionsProps) => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [seeReactors, setSeeReactors] = useState(false);
  const [postReacts, setPostReacts] = useState(Reacts);
  const [currentReact, setCurrentReact] = useState<reactions | null>(null);
  const [reactionTypes, setReactionTypes] = useState<string[]>([]);
  const [allReacts, setAllReacts] = useState<[string, number][]>([]);
  const [topThreeReacts, setTopThreeReacts] = useState<[string, number][]>([]);
  const [reactionAmount, setReactionAmount] = useState(0);
  const [isadd, setIsadd] = useState(false);

  const showReactorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const closeDisplay = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showReactorRef.current && !showReactorRef.current.contains(target)) {
        setSeeReactors(false);
      }
    };
    document.addEventListener("mousedown", closeDisplay);

    return () => document.removeEventListener("mousedown", closeDisplay);
  }, []);

  const giveReaction = async (
    e: React.MouseEvent<HTMLImageElement | HTMLDivElement, MouseEvent>
  ) => {
    if (
      e.target instanceof HTMLImageElement ||
      e.target instanceof HTMLDivElement
    ) {
      let reactionId =
        e.target.id === "" && !currentReact
          ? reactions.love
          : (e.target.id as reactions);

      if (e.target.id === "" && currentReact) reactionId = currentReact;
      setCurrentReact((prev) => (prev === reactionId ? null : reactionId));

      if (currentReact && reactionId !== currentReact) {
        try {
          const data = await AddRemoveReactionToPost(postId, reactionId);
          setPostReacts(data);
        } catch (error) {
          console.log(error);
        }
        return;
      }

      let updateLikesAmount: number;
      if (!currentReact && isadd) {
        updateLikesAmount = reactionAmount + 1;
        setReactionAmount(updateLikesAmount);
        setIsadd(false);
      }
      if (currentReact && !isadd) {
        if (reactionAmount === 0) return;
        updateLikesAmount = reactionAmount - 1;
        setIsadd(true);
        setReactionAmount(updateLikesAmount);
      }
      try {
        const data = await AddRemoveReactionToPost(postId, reactionId);
        setPostReacts(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (postReacts) {
      setReactionAmount(postReacts.length);
      setReactionTypes([]);
      postReacts.map((rec) => {
        setReactionTypes((prevTypes) => [...prevTypes, rec.react]);
        if (rec.reactorId === logInUser?._id) {
          setCurrentReact(rec.react as reactions);
          setIsadd(false);
        }
      });
    }
  }, [logInUser?._id, postReacts]);

  useEffect(() => {
    const reactionsCount: Record<string, number> = {
      love: 0,
      haha: 0,
      wow: 0,
      good_idea: 0,
      thanks: 0,
    };
    reactionTypes.map((currRec) => {
      reactionsCount[currRec] += 1;
    });

    const reactionsArray = Object.entries(reactionsCount).sort(
      (a, b) => b[1] - a[1]
    );

    setAllReacts(reactionsArray);
    setTopThreeReacts(reactionsArray.slice(0, 3));
  }, [reactionTypes]);

  return (
    <div className="flex gap-3 items-center">
      {seeReactors && (
        <div
          ref={showReactorRef}
          className="absolute -top-80 bg-[var(--light)] -right-3 border shadow-2xl w-[18rem] h-[19rem] overflow-y-scroll scrollbar-hide rounded pb-4 px-2"
        >
          <ReactsFilter
            allReacts={allReacts}
            postReacts={postReacts}
            setSeeReactors={(bool) => setSeeReactors(bool)}
          />
        </div>
      )}
      <div
        onClick={() => setSeeReactors(!seeReactors)}
        className="flex gap-2 cursor-pointer relative"
      >
        {reactionAmount > 0 && reactionAmount}

        {postReacts?.length === 0 && currentReact && (
          <img
            src={reactionImage[currentReact]}
            alt="react"
            className="w-7 h-7 absolute object-contain scale-[2.3] right-5"
          />
        )}
        {topThreeReacts?.map(
          (react, key) =>
            react[1] > 0 && (
              <img
                key={key + 1}
                src={reactionImage[react[0] as reactions]}
                alt={react[0]}
                className={`w-7 h-7 absolute object-contain scale-[2.3]
                  ${key === 0 && "right-9 z-[4]"} 
                  ${key === 1 && "right-7 z-[3]"}
                  ${key === 2 && "right-5 z-[2]"} `}
              />
            )
        )}
      </div>
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
              title="good_idea"
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
          onClick={giveReaction}
          className="p-3 bg-[var(--sec-light)] select-none rounded-full cursor-pointer text-[25px]"
        >
          {currentReact ? (
            <img
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
