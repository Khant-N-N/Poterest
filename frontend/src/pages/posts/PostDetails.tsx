import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { PiHeartStraightBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import good_idea from "../../assets/reacts/good idea.png";
import haha from "../../assets/reacts/haha.png";
import love from "../../assets/reacts/heart.png";
import thanks from "../../assets/reacts/thanks.png";
import wow from "../../assets/reacts/wow.png";
import DeletePostConfirm from "../../components/CreatePost/DeletePostConfirm";
import Loader from "../../components/Loader";
import { ClickFunc } from "../../components/PostFunctions";
import { showPostDetail } from "../../features/postSlice";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";
import { GetTargetPostDetails } from "../../networks/post.api";
import { GetTargetUser } from "../../networks/user.api";

const PostDetails = () => {
  const [profileLoading, setProfileLoading] = useState(false);
  const { logInUser } = useSelector((state: RootState) => state.user);
  const { postId } = useSelector((state: RootState) => state.post);
  const [postData, setPostData] = useState<Post | null>(null);
  const [postOwner, setPostOwner] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isImgLans, setIsImgLans] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getImageSize = () => {
      const width: number | undefined =
        document.getElementById("image")?.offsetWidth;
      const height: number | undefined =
        document.getElementById("image")?.offsetHeight;

      if (height! < width!) {
        setIsImgLans(true);
      } else {
        setIsImgLans(false);
      }
    };
    getImageSize();
  }, [postData]);

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GetTargetPostDetails(postId!);
        setPostData(data);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.error);
        }
        setLoading(false);
      }
    };
    getPostDetail();
  }, [postId]);

  const getPostOwner = useCallback(async () => {
    try {
      setProfileLoading(true);
      const user = await GetTargetUser(postData!.uploaderId);
      setPostOwner(user);
      setProfileLoading(false);
    } catch (error) {
      console.log(error);
      setProfileLoading(false);
    }
  }, [postData]);

  useEffect(() => {
    if (logInUser?._id !== postData?.uploaderId && postData) getPostOwner();
  }, [getPostOwner, logInUser?._id, postData]);

  return (
    <div className="absolute flex justify-center w-full h-full z-30 px-4 bg-[var(--light)]">
      <div
        onClick={() => dispatch(showPostDetail(false))}
        className="p-3 fixed z-10 left-5 md:left-16 md:text-[22px] shadow-2xl rounded-full bg-[var(--sec-light)]"
      >
        <FaArrowLeft />
      </div>
      {loading && (
        <div className="flex w-full h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {error && <p>{error}</p>}
      {!loading && !error && postData && (
        <div
          className={`${
            isImgLans ? "max-w-[800px]" : "max-w-[500px]"
          } shadow-2xl rounded-3xl overflow-y-scroll scrollbar-hide relative`}
        >
          <DeletePostConfirm
            onDisplay={(boolean) => setConfirmDelete(boolean)}
            isDisplay={confirmDelete}
            text="delete"
            postId={postData._id}
          />
          <img
            id="image"
            loading="lazy"
            src={postData.imgUrl}
            alt={postData.caption}
            className="w-full h-auto object-contain"
          />
          <div className="relative flex justify-between px-8 py-10 gap-2">
            {isShowMenu && (
              <ClickFunc
                onClick={() => setIsShowMenu(false)}
                post={postData}
                deletePost={() => setConfirmDelete(true)}
              />
            )}
            <div>
              <h2 className="font-semibold">{postData.caption}</h2>
              <p>{postData.description}</p>
            </div>
            <BiDotsVerticalRounded
              onClick={() => setIsShowMenu(!isShowMenu)}
              className="cursor-pointer text-[30px] rotate-90 hover:bg-[var(--sec-light)] rounded-full"
            />
          </div>
          <div className="mx-5 md:mx-9 flex justify-between">
            {profileLoading ? (
              <FaCircleUser className="text-[20px]" />
            ) : (
              <Link
                onClick={() => dispatch(showPostDetail(false))}
                to={
                  logInUser?._id === postData.uploaderId
                    ? "/profile"
                    : `/profile/${postData.uploaderId}`
                }
                className="flex gap-3 items-center cursor-pointer hover:underline"
              >
                <img
                  src={postOwner?.avatar || logInUser?.avatar}
                  alt="owner"
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover"
                />
                <p className="flex flex-col font-medium text-[17px]">
                  {postOwner?.username || logInUser?.username}
                  {postOwner?.followers.length === 0 && (
                    <span className="text-[14px] font-normal">
                      {postOwner?.followers.length}{" "}
                      {postOwner?.followers.length > 1
                        ? "followers"
                        : "follower"}
                    </span>
                  )}
                </p>
              </Link>
            )}

            <button className="p-3 bg-[var(--sec-light)] hover:opacity-80 rounded-full">
              Follow
            </button>
          </div>

          <div className="mx-5 my-8">
            <p className="font-semibold cursor-pointer hover:border-4 rounded-2xl">
              Comments
            </p>
          </div>

          <div className="sticky bottom-0 bg-[var(--light)] border-t-2 p-5">
            <div className="flex justify-between items-center mb-4 font-medium relative">
              <p>What do you think?</p>
              <div className="flex  gap-3 items-center">
                <div>2</div>
                <div className="group">
                  <div className="hidden group-hover:flex md:group-hover:-top-20 gap-3 bg-[var(--light)] shadow-2xl p-3 rounded-full absolute z-30 right-0 -top-14">
                    <img
                      title="good idea"
                      id="good idea"
                      src={good_idea}
                      alt="good react"
                      className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
                    />
                    <img
                      title="love"
                      id="love"
                      src={love}
                      alt="love react"
                      className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
                    />
                    <img
                      title="thanks"
                      id="thanks"
                      src={thanks}
                      alt="thanks react"
                      className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
                    />
                    <img
                      title="wow"
                      id="wow"
                      src={wow}
                      alt="wow react"
                      className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
                    />
                    <img
                      title="haha"
                      id="haha"
                      src={haha}
                      alt="haha react"
                      className="w-10 h-10 md:w-14 md:h-14 hover:scale-[1.3] hover:-translate-y-4 cursor-pointer transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-[var(--sec-light)] rounded-full cursor-pointer text-[25px]">
                    <PiHeartStraightBold />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <img
                src={logInUser?.avatar}
                alt="my profile"
                className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover"
              />
              {postData?.allowComment ? (
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="p-4 bg-[var(--sec-light)] focus:bg-transparent focus:border rounded-full w-full"
                />
              ) : (
                <p className="text-gray-400 text-[15px] md:text-[19px]">
                  This comment section is disabled by the owner
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
