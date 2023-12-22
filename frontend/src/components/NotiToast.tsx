const NotiToast = ({
  message,
  isToast,
}: {
  message: string;
  isToast: boolean;
}) => {
  return (
    <div
      className={`fixed ${
        isToast ? "scale-100" : "scale-0"
      } z-[99] top-28 text-center w-screen right-0`}
    >
      <span className="bg-black text-white p-3 rounded-lg text-[1rem]">
        {message}
      </span>
    </div>
  );
};

export default NotiToast;
