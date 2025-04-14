"use client";
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const Places = () => {
  const libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    libraries,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const inputRef = useRef(null);
  console.log("input ref: ", inputRef);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "RS" },
          fields: ["place_id", "geometry", "name", "formatted_address"],
          types: ["address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setSelectedPlace(place);
      });
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h1>Places Search</h1>
      <input
        type="text"
        placeholder="Search for a place"
        ref={inputRef}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          border: "1px solid white",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};

export default Places;
