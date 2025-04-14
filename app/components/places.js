"use client";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const lib = ["places"];

const Places = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    libraries: lib,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const inputRef = useRef(null);
  //console.log("input ref: ", inputRef);

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
      console.log(autocomplete);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log(place);

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
      <div style={{ height: "500px", width: "100%" }}>
        {selectedPlace && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={
              selectedPlace.geometry.location
                ? {
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng(),
                  }
                : { lat: 44.8176, lng: 20.4569 }
            }
            zoom={19}
          >
            <Marker
              position={{
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng(),
              }}
            />
          </GoogleMap>
        )}
        <h1 className="a"></h1>
      </div>
    </div>
  );
};

export default Places;
