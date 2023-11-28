import { useState, useEffect } from "react";
import "../styles/textChanger.css";
import { Link } from "react-router-dom";

const Home = () => {
  const texts: string[] = [
    "weeknight dinner idea",
    "home decor idea",
    "new look outfits",
    "green thumb idea",
  ];
  const [currentIndex, setcurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setcurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [texts.length]);

  return (
    <main>
      <section className="text-[35px] md:text-[50px] font-bold tracking-wide flex flex-col h-screen justify-center items-center">
        <h2 className="text-center">Get your next</h2>
        <h2 className="text-fade text-center my-3">{texts[currentIndex]}</h2>
        <div className="flex gap-3 justify-center my-6">
          <div
            className={`bg-[var(--sec-light)] w-4 h-4 rounded-full cursor-pointer`}
          />
          <div
            className={`bg-[var(--sec-light)] w-4 h-4 rounded-full cursor-pointer`}
          />
          <div
            className={`bg-[var(--sec-light)] w-4 h-4 rounded-full cursor-pointer`}
          />
          <div
            className={`bg-[var(--sec-light)] w-4 h-4 rounded-full cursor-pointer`}
          />
        </div>
        <Link
          to="/login"
          className="py-4 px-8 mt-10 bg-[var(--pri-red)] text-[22px] hover:bg-[var(--sec-red)] text-white rounded-full"
        >
          Log In
        </Link>
      </section>
    </main>
  );
};

export default Home;
