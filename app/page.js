import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

async function Home() {
  return (
    <div className="p-4">
      <Header />
      {/* <Places /> */}
      <h1 className="text-black">HOMEEE PAGEEE</h1>
      <Hero />
    </div>
  );
}

export default Home;
