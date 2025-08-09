import Places from "../components/PlacePicker";

import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

async function Home() {
  return (
    <div className="p-4">
      <Header />
      {/* <Places /> */}
      <h1 className="text-black">HOMEEE PAGEEE</h1>
    </div>
  );
}

export default Home;
