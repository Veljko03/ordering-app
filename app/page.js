import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

async function Home() {
  return (
    <div className="p-4 bg-[#f3f3f4] min-h-screen">
      <Hero />
    </div>
  );
}

export default Home;
