const Loader = () => {
  return (
    <div className="relative">
      <div className="bg-[var(--sec-light)] p-7 rounded-full animate-spin">
        <div
          className={`bg-[var(--sec-red)] w-4 h-4 rounded-full absolute top-3 right-3`}
        />
        <div
          className={`bg-[var(--sec-red)] w-4 h-4 rounded-full absolute top-8 right-4`}
        />
        <div
          className={`bg-[var(--sec-red)] w-4 h-4 rounded-full absolute top-5 right-8`}
        />
      </div>
    </div>
  );
};

export default Loader;
