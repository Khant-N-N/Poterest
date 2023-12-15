import axios from "axios";
import { useCallback, useEffect, useReducer } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import DeletePostConfirm from "../../components/CreatePost/DeletePostConfirm";
import Loader from "../../components/Loader";
import AddComment from "../../components/PostDetails/AddComment";
import CommentsOfPost from "../../components/PostDetails/CommentsOfPost";
import Reacts from "../../components/PostDetails/Reacts";
import { ClickFunc } from "../../components/PostFunctions";
import { showPostDetail } from "../../features/postSlice";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";
import { GetTargetPostDetails } from "../../networks/post.api";
import { GetTargetUser } from "../../networks/user.api";

interface InitialValuesTypes {
  postData: Post | null;
  profileLoading: boolean;
  postOwner: User | null;
  error: string | null;
  loading: boolean;
  confirmDelete: boolean;
  isShowMenu: boolean;
  isImgLans: boolean;
}
interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}
const initialValues: InitialValuesTypes = {
  postData: null,
  profileLoading: false,
  postOwner: null,
  error: null,
  loading: false,
  confirmDelete: false,
  isShowMenu: false,
  isImgLans: false,
};

const reducer = (state: InitialValuesTypes, action: Action) => {
  switch (action.type) {
    case "SET_POSTDATA":
      return { ...state, postData: action.payload };
    case "PROFILE_LOADING":
      return { ...state, profileLoading: action.payload };
    case "GET_POSTOWNER":
      return { ...state, postOwner: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "DELETE_CONFIRM":
      return { ...state, confirmDelete: action.payload };
    case "PAGE_LOADING":
      return { ...state, loading: action.payload };
    case "IS_SHOW_MENU":
      return { ...state, isShowMenu: action.payload };
    case "IS_IMG_LANSCAPE":
      return { ...state, isImgLans: action.payload };

    default:
      return state;
  }
};

const PostDetails = () => {
  const [state, reducerDispatch] = useReducer(reducer, initialValues);
  const { logInUser } = useSelector((state: RootState) => state.user);
  const { postId } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    const getImageSize = () => {
      const width: number | undefined =
        document.getElementById("image")?.offsetWidth;
      const height: number | undefined =
        document.getElementById("image")?.offsetHeight;

      if (height! < width!) {
        reducerDispatch({ type: "IS_IMG_LANSCAPE", payload: true });
      } else {
        reducerDispatch({ type: "IS_IMG_LANSCAPE", payload: false });
      }
    };
    getImageSize();
  }, [state.postData]);

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        reducerDispatch({ type: "PAGE_LOADING", payload: true });
        reducerDispatch({ type: "SET_ERROR", payload: null });
        const data = await GetTargetPostDetails(postId!);
        reducerDispatch({ type: "SET_POSTDATA", payload: data });
        reducerDispatch({ type: "PAGE_LOADING", payload: false });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reducerDispatch({
            type: "SET_ERROR",
            payload: error.response?.data.error,
          });
        }
        reducerDispatch({ type: "PAGE_LOADING", payload: false });
      }
    };
    getPostDetail();
  }, [postId]);

  const getPostOwner = useCallback(async () => {
    try {
      reducerDispatch({ type: "PROFILE_LOADING", payload: true });
      const user = await GetTargetUser(state.postData!.uploaderId);
      reducerDispatch({ type: "GET_POSTOWNER", payload: user });
      reducerDispatch({ type: "PROFILE_LOADING", payload: false });
    } catch (error) {
      console.log(error);
      reducerDispatch({ type: "PROFILE_LOADING", payload: false });
    }
  }, [state.postData]);

  useEffect(() => {
    if (logInUser?._id !== state.postData?.uploaderId && state.postData)
      getPostOwner();
  }, [getPostOwner, logInUser?._id, state.postData]);

  return (
    <div className="fixed top-0 pt-10 md:pt-24 flex flex-col items-center w-full h-full z-30 px-4 bg-[var(--light)]">
      <div
        onClick={() => dispatch(showPostDetail(false))}
        className="p-3 fixed cursor-pointer z-10 left-5 md:left-16 md:text-[22px] shadow-2xl rounded-full bg-[var(--sec-light)]"
      >
        <FaArrowLeft />
      </div>
      {state.loading && (
        <div className="flex w-full h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {state.error && <p>{state.error}</p>}
      {!state.loading && !state.error && state.postData && (
        <div
          className={`${
            state.isImgLans ? "max-w-[800px]" : "max-w-[500px]"
          } shadow-2xl rounded-3xl overflow-y-scroll mb-10 md:mb-2 scrollbar-hide relative`}
        >
          <DeletePostConfirm
            onDisplay={(boolean) =>
              reducerDispatch({ type: "DELETE_CONFIRM", payload: boolean })
            }
            isDisplay={state.confirmDelete}
            text="delete"
            postId={state.postData._id}
          />
          <a href={state.postData.imgUrl} target="_blank">
            <img
              id="image"
              loading="lazy"
              src={state.postData.imgUrl}
              alt={state.postData.caption}
              className="w-full h-auto object-contain"
            />
          </a>
          <div className="relative flex justify-between px-8 pt-4 pb-10 gap-2">
            {state.isShowMenu && (
              <ClickFunc
                onClick={() =>
                  reducerDispatch({ type: "IS_SHOW_MENU", payload: false })
                }
                post={state.postData}
                deletePost={() =>
                  reducerDispatch({ type: "DELETE_CONFIRM", payload: true })
                }
              />
            )}
            <div className="w-4/5">
              <h2 className="font-semibold">{state.postData.caption}</h2>
              <p>{state.postData.description}</p>
            </div>
            <BiDotsVerticalRounded
              onClick={() =>
                reducerDispatch({
                  type: "IS_SHOW_MENU",
                  payload: !state.isShowMenu,
                })
              }
              className="cursor-pointer text-[30px] rotate-90 hover:bg-[var(--sec-light)] rounded-full"
            />
          </div>
          <div className="mx-5 md:mx-9 flex justify-between">
            {state.profileLoading ? (
              <FaCircleUser className="text-[20px]" />
            ) : (
              <Link
                onClick={() => dispatch(showPostDetail(false))}
                to={
                  logInUser?._id === state.postData.uploaderId
                    ? "/profile"
                    : `/profile/${state.postData.uploaderId}`
                }
                className="flex gap-3 items-center cursor-pointer hover:underline"
              >
                <img
                  src={state.postOwner?.avatar || logInUser?.avatar}
                  alt="owner"
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover"
                />
                <p className="flex flex-col font-medium text-[17px]">
                  {state.postOwner?.username || logInUser?.username}
                  {state.postOwner?.followers.length === 0 && (
                    <span className="text-[14px] font-normal">
                      {state.postOwner?.followers.length}{" "}
                      {state.postOwner?.followers.length > 1
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

          <CommentsOfPost postData={state.postData} />

          <div className="sticky bottom-0 bg-[var(--light)] border-t-2 p-5">
            <div className="flex justify-between items-center mb-4 font-medium relative">
              {/* <p>
                {state.postData.comments.length
                  ? state.postData.comments.length + " comments"
                  : "What do you think?"}
              </p> */}

              <Reacts postData={state.postData} />
            </div>
            <AddComment postData={state.postData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
