import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";

interface TopicType {
  topic: string;
  onSelect: (topic: string) => void;
  selectedTopics: string[];
}
const Topic = ({ topic, onSelect, selectedTopics }: TopicType) => {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(selectedTopics.some((selected) => selected === topic));
  }, [selectedTopics, topic]);

  return (
    <span
      onClick={() => {
        setAdded(!added);
        onSelect(topic);
      }}
      className={`${
        added ? "bg-[var(--sec-red)] text-white" : "bg-[var(--light)]"
      } flex transition-colors items-center gap-3 select-none capitalize rounded-xl cursor-pointer px-3 py-1`}
    >
      {topic} {added ? <FaXmark /> : <TiPlus />}
    </span>
  );
};

export default Topic;
