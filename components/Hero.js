"use client";

import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div>
      <button
        className="bg-orange-400 text-white cursor-pointer rounded-t-2xl p-2"
        onClick={() => router.push("/menu")}
      >
        See menu
      </button>
    </div>
  );
};

export default Hero;
