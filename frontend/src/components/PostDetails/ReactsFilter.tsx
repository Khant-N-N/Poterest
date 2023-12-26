import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import good_idea from "../../assets/reacts/good idea.png";
import haha from "../../assets/reacts/haha.png";
import love from "../../assets/reacts/heart.png";
import thanks from "../../assets/reacts/thanks.png";
import wow from "../../assets/reacts/wow.png";
import { Reaction } from "../../models/post.model";
import GetReactors from "./GetReactors";

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

interface ReactsFilterProps {
  allReacts: [string, number][];
  postReacts: Reaction[];
  setSeeReactors: (bool: boolean) => void;
}

const ReactsFilter = ({
  allReacts,
  postReacts,
  setSeeReactors,
}: ReactsFilterProps) => {
  const [filteredReacts, setFilteredReacts] = useState(postReacts);
  const [currentReact, setCurrentReact] = useState<reactions | "all">("all");

  const handleFilter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target instanceof HTMLDivElement) {
      const target = e.target.id as reactions | "all";
      setCurrentReact(target);
    }
  };

  useEffect(() => {
    setFilteredReacts(
      currentReact === "all"
        ? postReacts
        : postReacts.filter((rec) => rec.react === currentReact)
    );
  }, [currentReact, postReacts]);

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2 p-1 mb-4">
        <div className="flex">
          <div
            onClick={handleFilter}
            id="all"
            className={`${
              currentReact === "all" && "bg-[var(--sec-light)]"
            } cursor-pointer border-r px-2 text-center`}
          >
            All <br /> {postReacts.length}
          </div>
          {allReacts.map(
            (rec, key) =>
              rec[1] > 0 && (
                <div
                  key={key + rec[0]}
                  className={`${
                    currentReact === rec[0] && "bg-[var(--sec-light)]"
                  } flex flex-col items-center justify-center cursor-pointer border-r px-2 relative`}
                >
                  <div
                    onClick={handleFilter}
                    id={rec[0]}
                    className="absolute w-full h-full"
                  />
                  <img
                    src={reactionImage[rec[0] as reactions]}
                    alt={rec[0]}
                    className="w-7 h-7 object-contain"
                  />
                  <span>{rec[1]}</span>
                </div>
              )
          )}
        </div>
        <FaXmark
          onClick={() => setSeeReactors(false)}
          className="hover:bg-[var(--sec-light)] rounded-full cursor-pointer my-3"
        />
      </div>
      {filteredReacts.map((reac) => (
        <GetReactors reac={reac} key={reac._id} />
      ))}
    </>
  );
};

export default ReactsFilter;
