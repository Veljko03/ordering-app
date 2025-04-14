"use client";
import { useState } from "react";
import Places from "./components/places";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    radius: 500,
  });

  const [latitude, setLatitude] = useState(24.799448);
  const [longitude, setLongitude] = useState(54.799448);
  const [address, setAdress] = useState("");

  return (
    <div style={{ padding: "50px" }}>
      <h1>Hello world</h1>
      <Places />
    </div>
  );
}
