import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Link, useNavigate } from "react-router-dom";
import { UpdateUser } from "../../networks/user.api";
import { getAuthenticatedUser } from "../../features/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import axios from "axios";
import Loader from "../../components/Loader";

const ProfileEdit = () => {
  const { logInUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    avatar: logInUser?.avatar,
    username: logInUser?.username,
    email: logInUser?.email,
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleProfileUpload = (imgFile: File) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imgFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imgFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercent(Math.round(progress));
        },
        (error) => {
          console.log(error);
          setEditError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, avatar: downloadUrl });
          });
        }
      );
    };
    if (file && file?.type.startsWith("image")) handleProfileUpload(file);
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setEditError(null);
      setLoading(true);
      const parameters = { id: logInUser?._id, formData };
      const updatedUser = await UpdateUser(parameters);
      dispatch(getAuthenticatedUser(updatedUser));
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response
          ? setEditError(error.response.data.error)
          : setEditError("Something went wrong, Please try again");
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen w-full bg-black/40 z-50 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <main className="flex flex-col items-center gap-4 justify-center min-h-screen mt-24">
          <div className="flex flex-col items-center gap-3 relative">
            <input
              hidden
              type="file"
              id="imageUpload"
              accept="image/*"
              ref={fileRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <img
              src={formData.avatar}
              alt="profile"
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
            />
            {uploadPercent !== 100 && uploadPercent !== null && (
              <div className="absolute top-5">
                <Loader />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              type="button"
              className="bg-[var(--sec-light)] p-3 rounded-full font-semibold hover:bg-gray-400"
            >
              Change
            </button>
          </div>
          {editError && <p className="text-red-500 text-center">{editError}</p>}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center relative"
          >
            <label className="w-[90%] mt-3" htmlFor="email">
              Email
            </label>
            <input
              className="w-[90%] py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              spellCheck={false}
            />
            <label className="w-[90%] mt-3" htmlFor="username">
              Username
            </label>
            <input
              className="w-[90%] py-4 px-5 rounded-3xl border-[3px] border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              spellCheck={false}
            />
            <button
              type="submit"
              className="bg-[var(--pri-red)] hover:bg-[var(--sec-red)] text-white w-[90%] mt-5 p-3 rounded-full"
            >
              Save
            </button>
            <Link
              to="/profile"
              className="bg-[var(--sec-light)] hover:bg-gray-400 text-center w-[90%] mt-5 p-3 rounded-full"
            >
              Cancel
            </Link>
          </form>
        </main>
      )}
    </>
  );
};

export default ProfileEdit;
