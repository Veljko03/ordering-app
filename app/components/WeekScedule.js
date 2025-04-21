"use client";

import { useState } from "react";

const WeekScedule = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowPopup(true)}
        className="mt-10 text-2xl bg-amber-50 text-red-700  w-100 rounded-2xl"
      >
        Set your restaurant scedule
      </button>
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

            <div>
              <h1>ovde dodati logiku za dane i za izuzetke....</h1>
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

export default WeekScedule;
