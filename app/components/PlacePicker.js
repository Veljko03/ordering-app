"use client";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { deliveryPrices } from "../placesData/deliveryPrices";

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
    <div>
      <button
        className="bg-white text-black w-200 h-8 rounded-sm "
        onClick={() => setShowPopup(true)}
      >
        Enter your adrress
      </button>
      {selectedPlace && (
        <h1 className="mt-5 text-2xl font-bold">
          Vasa adresa je: {selectedPlace.formatted_address}
        </h1>
      )}
      {deliveryPrice && (
        <h1 className="mt-5 text-2xl font-bold">
          Cena vase dostave je: {deliveryPrice} rsd
        </h1>
      )}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/55 flex  items-center justify-center"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white text-black w-200 h-150 flex flex-col gap-2 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="bg-red-600 cursor-pointer rounded  w-20 ml-auto"
              onClick={() => {
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
                  if (!selectedPlace) setSelectedPlace(null);
                  if (!deliveryPrice) setDeliveryPrice(null);
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
