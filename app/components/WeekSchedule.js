"use client";

import { useState } from "react";

const WeekSchedule = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timesForEachDay, setTimesForEachDay] = useState({
    monStart: "",
    monEnd: "",
    tueStart: "",
    tueEnd: "",
    wenStart: "",
    wenEnd: "",
    thuStart: "",
    thuEnd: "",
    friStart: "",
    friEnd: "",
    satStart: "",
    satEnd: "",
    sunStart: "",
    sunEnd: "",
  });

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setTimesForEachDay((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleTimeFormSubmit = (e) => {
    e.preventDefault();
    const formmatedData = formatForBackend(timesForEachDay);
    console.log(formmatedData, "formmated");

    fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify(formmatedData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => console.log("Saved:", data))
      .catch((err) => console.error("Error:", err));
  };

  const formatForBackend = (currSchedule) => {
    const days = ["mon", "tue", "wen", "thu", "fri", "sat", "sun"];
    return days.map((day) => ({
      day,
      startTime: currSchedule[`${day}Start`] || null,
      endTime: currSchedule[`${day}End`] || null,
      isClosed: !currSchedule[`${day}Start`] && !currSchedule[`${day}End`],
    }));
  };
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
            <form
              className="flex flex-col mt-5 bg-gray-300 p-5 gap-2 "
              onSubmit={handleTimeFormSubmit}
            >
              <div className="flex items-center">
                <h1>Ponedeljak</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="monStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="monEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Utorak</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="tueStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="tueEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Sreda</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="wenStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="wenEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Cetvrtak</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="thuStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="thuEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Petak</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="friStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="friEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Subota</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="satStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="satEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <h1>Nedelja</h1>{" "}
                <div className="ml-auto">
                  <h1>Pocetak</h1>
                  <input
                    name="sunStart"
                    className="ml-auto"
                    onChange={handleTimeChange}
                    aria-label="Time"
                    type="time"
                  />
                </div>
                <div className="ml-15">
                  <h1>Kraj</h1>
                  <input
                    name="sunEnd"
                    onChange={handleTimeChange}
                    className="ml-auto"
                    aria-label="Time"
                    type="time"
                  />
                </div>
              </div>
              <button type="submit">Sacuvaj</button>
            </form>

            <div className=" mt-5">
              <h1>Izuzeci...</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekSchedule;
