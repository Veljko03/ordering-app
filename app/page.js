"use client";

import Places from "./components/PlacePicker";
import WeekSchedule from "./components/WeekSchedule";

export default function Home() {
  return (
    <div style={{ padding: "50px" }}>
      <h1 className="underline"> Hello world</h1>
      <Places />

      <WeekSchedule />
    </div>
  );
}
