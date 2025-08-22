"use client";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { deliveryPrices } from "../app/admin/placesData/deliveryPrices";
import { FaLocationArrow } from "react-icons/fa";
import { FaLocationPin, FaX } from "react-icons/fa6";

const lib = ["places"];

const Places = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    libraries: lib,
    language: "sr",
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const inputRef = useRef(null);
  // if (navigator.geolocation) {
  //   console.log(navigator.geolocation.getCurrentPosition(success, error));
  // } else {
  //   console.log("Geolocation not supported");
  // }
  // function success(position) {
  //   const latitude = position.coords.latitude;
  //   const longitude = position.coords.longitude;
  //   console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  // }

  // function error() {
  //   console.log("Unable to retrieve your location");
  // }

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "RS" },
          fields: [
            "place_id",
            "geometry",
            "name",
            "formatted_address",
            "address_components",
          ],
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

        // const hasStreetNumber = place.address_components.some((c) =>
        //   c.types.includes("street_number")
        // );

        // if (!hasStreetNumber) {
        //   alert("Molimo odaberite adresu koja sadrži broj ulice.");
        //   return;
        // }
        setSelectedPlace(place);
        setDeliveryPrice(null);
      });
    }
  }, [isLoaded, showPopup]);

  if (selectedPlace) {
    const userPoint1 = selectedPlace.geometry.location.lat();
    const userPoint2 = selectedPlace.geometry.location.lng();

    if (userPoint1 && userPoint2) {
      const userPosition = point([userPoint2, userPoint1]);
      const validZones = deliveryPrices.filter(
        (zone) => zone.coordinates && zone.coordinates.length > 0
      );
      console.log("user position", userPosition);
      console.log("valid zones ", validZones);

      validZones.forEach((cityArea) => {
        if (deliveryPrice) return;
        const poly = polygon(cityArea.coordinates);
        if (booleanPointInPolygon(userPosition, poly)) {
          console.log("Cena dostave je ", cityArea.price);
          setDeliveryPrice(cityArea.price);
        }
      });
    }
  }

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;
  console.log("Selected place name ", selectedPlace);

  return (
    <div className="mb-2">
      {!selectedPlace && (
        <div className="rounded-2xl bg-white p-4 shadow-md flex items-center  justify-center">
          <button
            className="flex items-center  gap-3 cursor-pointer text-gray-700 hover:text-orange-500 transition"
            onClick={() => setShowPopup(true)}
          >
            <FaLocationArrow className="w-5 h-5" />
            <span className="text-lg">Na kojoj si adresi?</span>
          </button>
        </div>
      )}
      {selectedPlace && (
        <div className="rounded-2xl bg-white p-4 shadow-md flex flex-col items-center gap-2 text-center">
          <FaLocationArrow className="w-6 h-6 text-indigo-600" />
          <p className="font-medium text-gray-800">
            {selectedPlace.formatted_address}
          </p>
          {deliveryPrice && (
            <p className="text-green-600 font-semibold">
              Cena dostave: {deliveryPrice} RSD
            </p>
          )}
          <button
            onClick={() => setShowPopup(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-orange-400 text-white hover:bg-orange-500  cursor-pointer transition"
          >
            Promeni adresu
          </button>
        </div>
      )}

      {showPopup && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative bg-white p-6 rounded-lg w-[90%] sm:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 cursor-pointer  text-red-600 hover:text-red-800"
              onClick={() => {
                setShowPopup(false);
                if (!selectedPlace) {
                  setSelectedPlace(null);
                  setDeliveryPrice(null);
                }
              }}
            >
              <FaX className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Unesite naziv ulice"
              ref={inputRef}
              className="w-full p-3 border border-gray-300 rounded-xl text-black mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Map */}
            <div className="w-full h-64 rounded-xl overflow-hidden mb-4">
              {selectedPlace && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{
                    lat: selectedPlace.geometry?.location.lat(),
                    lng: selectedPlace.geometry?.location.lng(),
                  }}
                  zoom={17}
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

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => {
                  setShowPopup(false);
                  setSelectedPlace(null);
                  setDeliveryPrice(null);
                }}
              >
                Poništi
              </button>
              <button
                className="px-4 py-2 rounded-xl cursor-pointer bg-indigo-500 text-white hover:bg-indigo-600 transition"
                onClick={() => setShowPopup(false)}
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
