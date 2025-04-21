"use client";

import Places from "./components/PlacePicker";
import WeekScedule from "./components/WeekScedule";

export default function Home() {
  return (
    <div style={{ padding: "50px" }}>
      <h1 className="underline"> Hello world</h1>
      <Places />
      <WeekScedule />
    </div>
  );
}
