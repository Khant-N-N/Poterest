import { FaChevronRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Topic from "./Topic";
import SearchTopics from "./SearchTopics";

const topics = ["Comedy", "music", "anime", "games", "girls", "boys", "cars"];

type SelectedTopicsType = typeof topics;

interface TagProps {
  setTopic: (topic: SelectedTopicsType) => void;
}

const TagTopics = ({ setTopic }: TagProps) => {
  const [selectedTopics, setSelectedTopics] = useState<SelectedTopicsType>([]);
  const [isSelectTopic, setIsSelectTopic] = useState(false);
  const [searchedTopics, setSearchedTopics] =
    useState<SelectedTopicsType>(topics);

  useEffect(() => {
    setTopic(selectedTopics);
  }, [selectedTopics]);

  const handleSearch = (keyword: string) => {
    setSearchedTopics(
      topics.filter((topic) =>
        topic.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  return (
    <div
      className={`${
        isSelectTopic ? "mb-28" : "mb-3"
      } border-b border-black relative`}
    >
      <div>
        <div
          onClick={() => setIsSelectTopic(!isSelectTopic)}
          className="cursor-pointer py-3 flex items-center justify-between"
        >
          Tag Topics {isSelectTopic ? <FaXmark /> : <FaChevronRight />}
        </div>
        <div className="flex flex-wrap gap-4 mb-1">
          {selectedTopics.length !== 0 &&
            selectedTopics.map((topic, key) => (
              <Topic
                selectedTopics={selectedTopics}
                topic={topic}
                key={key}
                onSelect={(addTopic) => {
                  setSelectedTopics((prevTopics) => {
                    return selectedTopics.some(
                      (storeTopic) => addTopic === storeTopic
                    )
                      ? selectedTopics.filter((to) => to !== addTopic)
                      : [...prevTopics, addTopic];
                  });
                }}
              />
            ))}
        </div>
      </div>
      {isSelectTopic && (
        <div className="absolute w-full bg-[var(--sec-light)] py-7 px-5 z-10 h-[17rem] overflow-y-scroll">
          <div className="sticky top-0">
            <SearchTopics onSearch={handleSearch} />
          </div>
          <p className="text-[15px] md:text-[17px] text-gray-500 my-2">
            Adding related topics to reach people interested in post like yours.
            People won't see your tagged topics.
          </p>

          <div className="flex flex-wrap gap-4">
            {searchedTopics.map((topic, key) => (
              <Topic
                selectedTopics={selectedTopics}
                topic={topic}
                key={key}
                onSelect={(addTopic) => {
                  setSelectedTopics((prevTopics) => {
                    return selectedTopics.some(
                      (storeTopic) => addTopic === storeTopic
                    )
                      ? selectedTopics.filter((to) => to !== addTopic)
                      : [...prevTopics, addTopic];
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagTopics;
