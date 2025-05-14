"use client";

import { useEffect, useState } from "react";

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
  const [backendData, setBackendData] = useState(null);
  const [restaurantWorks, setRestaurantWorks] = useState(null);

  useEffect(() => {
    fetch("/api/schedule", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((dataa) => {
        console.log("dataaaaaa ", dataa);
        setBackendData(dataa);
        const data = dataa[0].schedule;
        const transformedData = {
          monStart: data.find((day) => day.day === "mon")?.startTime || "",
          monEnd: data.find((day) => day.day === "mon")?.endTime || "",
          tueStart: data.find((day) => day.day === "tue")?.startTime || "",
          tueEnd: data.find((day) => day.day === "tue")?.endTime || "",
          wenStart: data.find((day) => day.day === "wen")?.startTime || "",
          wenEnd: data.find((day) => day.day === "wen")?.endTime || "",
          thuStart: data.find((day) => day.day === "thu")?.startTime || "",
          thuEnd: data.find((day) => day.day === "thu")?.endTime || "",
          friStart: data.find((day) => day.day === "fri")?.startTime || "",
          friEnd: data.find((day) => day.day === "fri")?.endTime || "",
          satStart: data.find((day) => day.day === "sat")?.startTime || "",
          satEnd: data.find((day) => day.day === "sat")?.endTime || "",
          sunStart: data.find((day) => day.day === "sun")?.startTime || "",
          sunEnd: data.find((day) => day.day === "sun")?.endTime || "",
        };

        setTimesForEachDay(transformedData);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  const getDayInWeek = (dayInDig) => {
    if (dayInDig === 1) {
      return "mon";
    } else if (dayInDig === 2) {
      return "tue";
    } else if (dayInDig === 3) {
      return "wen";
    } else if (dayInDig === 4) {
      return "thu";
    } else if (dayInDig === 5) {
      return "fri";
    } else if (dayInDig === 6) {
      return "sat";
    } else {
      return "sun";
    }
  };
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours(); // Dobijamo sate (0-23)
    const minutes = now.getMinutes(); // Dobijamo minute (0-59)
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Dodajemo nulu za minute ako su ispod 10
  };

  //checking for current day values to see if restaurant works
  if (backendData && !restaurantWorks) {
    const d = new Date();
    let day = d.getDay();
    const dayInWeek = getDayInWeek(day);
    const currTime = getCurrentTime();
    console.log(backendData, "backend  ");
    console.log("day in week ", dayInWeek);

    const currentDaySchedule = backendData[0].schedule.find(
      (schedule) => schedule.day === dayInWeek
    );
    console.log("curr day ", currentDaySchedule);

    if (currentDaySchedule?.isClosed) {
      console.log("Restoran je zatvoren danas.");
    } else {
      console.log("currDateschedule ", currentDaySchedule);

      const { startTime, endTime } = currentDaySchedule;

      if (
        startTime &&
        endTime &&
        currTime >= startTime &&
        currTime <= endTime
      ) {
        setRestaurantWorks("Restoran radi!");
        console.log("Restoran radi!");
      } else {
        console.log("Restoran trenutno ne radi.");
        setRestaurantWorks("Restoran trenutno ne radi.");
      }
    }
  }

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
      {restaurantWorks && <h1 className="mt-5 text-2xl ">{restaurantWorks}</h1>}
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
                    value={timesForEachDay.monStart}
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
                    value={timesForEachDay.monEnd}
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
                    value={timesForEachDay.thuStart}
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
                    value={timesForEachDay.thuEnd}
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
                    value={timesForEachDay.wenStart}
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
                    value={timesForEachDay.wenEnd}
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
                    value={timesForEachDay.thuStart}
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
                    value={timesForEachDay.thuEnd}
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
                    value={timesForEachDay.friStart}
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
                    value={timesForEachDay.friEnd}
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
                    value={timesForEachDay.satStart}
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
                    value={timesForEachDay.satEnd}
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
                    value={timesForEachDay.sunStart}
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
                    value={timesForEachDay.sunEnd}
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
