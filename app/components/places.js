"use client";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const lib = ["places"];

const Places = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    libraries: lib,
    language: "sr",
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const inputRef = useRef(null);
  // resiti error ako je losa adresa
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "RS" },
          fields: ["place_id", "geometry", "name", "formatted_address"],
          types: ["address"],
          bounds: new google.maps.LatLngBounds( //Novi sad coord
            { lat: 45.19, lng: 19.67 },
            { lat: 45.31873, lng: 19.90285 }
          ),
          strictBounds: true,
        }
      );
      console.log(autocomplete);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log(place);
        if (!place.geometry || !place.formatted_address) {
          setSelectedPlace(null);
          alert("bad address");
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          return;
        }
        setSelectedPlace(place);
      });
    }
  }, [isLoaded, showPopup]);

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <button
        className="bg-white text-black w-200 h-8 rounded-sm "
        onClick={() => setShowPopup(true)}
      >
        Enter your adrress
      </button>
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/55 flex  items-center justify-center"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white text-black w-200 h-200 flex flex-col gap-2 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="bg-red-600 cursor-pointer rounded  w-20 ml-auto"
              onClick={() => {
                setSelectedPlace(null);
                setShowPopup(false);
              }}
            >
              Close
            </button>
            <input
              type="text"
              placeholder="Search for a place"
              ref={inputRef}
              className="rounded-md border-white border-black p-4 w-full"
            />
            <div className="h-300 w-full">
              {selectedPlace && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={
                    selectedPlace.geometry?.location
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
                      lat: selectedPlace.geometry?.location.lat(),
                      lng: selectedPlace.geometry?.location.lng(),
                    }}
                  />
                </GoogleMap>
              )}
            </div>
            <div className="flex gap-20 items-center justify-center mt-5">
              <button
                className="bg-red-600 cursor-pointer rounded  w-20 "
                onClick={() => {
                  setShowPopup(false);
                  setSelectedPlace(null);
                }}
              >
                Cancle
              </button>
              <button
                className="bg-green-500 cursor-pointer rounded  w-20 "
                onClick={() => setShowPopup(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
