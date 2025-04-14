"use client";
import { useState } from "react";
import Places from "./components/places";

export default function Home() {
  return (
    <div style={{ padding: "50px" }}>
      <h1 className="underline"> Hello world</h1>
      <Places />
    </div>
  );
}
