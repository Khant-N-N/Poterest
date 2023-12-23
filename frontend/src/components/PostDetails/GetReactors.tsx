import React, { useEffect, useState } from "react";
import good_idea from "../../assets/reacts/good idea.png";
import haha from "../../assets/reacts/haha.png";
import love from "../../assets/reacts/heart.png";
import thanks from "../../assets/reacts/thanks.png";
import wow from "../../assets/reacts/wow.png";
import { Reaction } from "../../models/post.model";
import { User } from "../../models/user.model";
import { GetTargetUser } from "../../networks/user.api";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showPostDetail } from "../../features/postSlice";

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

const GetReactors = ({ reac }: { reac: Reaction }) => {
  const [reactor, setReactor] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getReactor = async () => {
      try {
        setLoading(true);
        const reactor = await GetTargetUser(reac.reactorId);
        setReactor(reactor);
        setLoading(false);
      } catch (error) {
        setError("something went wrong!");
        setLoading(false);
      }
    };
    getReactor();
  }, [reac.reactorId]);

  return (
    <div className="w-full flex gap-2 items-center justify-between mb-3 text-[15px] px-2">
      {loading ? (
        <FaCircleUser />
      ) : (
        <Link
          className="flex gap-2"
          to={`/profile/${reactor?._id}`}
          onClick={() => dispatch(showPostDetail(false))}
        >
          <img
            loading="lazy"
            src={reactor?.avatar}
            alt={reactor?.username}
            className="w-6 h-6 object-cover rounded-full"
          />
          <p>{reactor?.username}</p>
        </Link>
      )}
      <img
        src={reactionImage[reac.react as reactions]}
        alt={reac.react}
        className="w-7 h-7 object-contain"
      />
    </div>
  );
};

export default GetReactors;
