"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// namestiti kada restoran radi do posle ponoci jer imam gresku ako stavim recimo da radi od 10 do 1 u ponoc
// on ce obracunati 1  u ponoc kao 60 min i porediti to sa vremenom ovim
//tako da mora nekako
const WeekSchedule = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timesForEachDay, setTimesForEachDay] = useState({
    monStart: "",
    monEnd: "",
    monClosed: false,
    tueStart: "",
    tueEnd: "",
    tueClosed: false,
    wenStart: "",
    wenEnd: "",
    wenClosed: false,
    thuStart: "",
    thuEnd: "",
    thuClosed: false,
    friStart: "",
    friEnd: "",
    friClosed: false,
    satStart: "",
    satEnd: "",
    satClosed: false,
    sunStart: "",
    sunEnd: "",
    sunClosed: false,
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
        setBackendData(dataa);
        const data = dataa[0].schedule;
        const transformedData = {
          monStart: data.find((day) => day.day === "mon")?.startTime || "",
          monEnd: data.find((day) => day.day === "mon")?.endTime || "",
          monClosed: data.find((day) => day.day === "mon")?.isClosed || false,
          tueStart: data.find((day) => day.day === "tue")?.startTime || "",
          tueEnd: data.find((day) => day.day === "tue")?.endTime || "",
          tueClosed: data.find((day) => day.day === "tue")?.isClosed || false,

          wenStart: data.find((day) => day.day === "wen")?.startTime || "",
          wenEnd: data.find((day) => day.day === "wen")?.endTime || "",
          wenClosed: data.find((day) => day.day === "wen")?.isClosed || false,

          thuStart: data.find((day) => day.day === "thu")?.startTime || "",
          thuEnd: data.find((day) => day.day === "thu")?.endTime || "",
          thuClosed: data.find((day) => day.day === "thu")?.isClosed || false,

          friStart: data.find((day) => day.day === "fri")?.startTime || "",
          friEnd: data.find((day) => day.day === "fri")?.endTime || "",
          friClosed: data.find((day) => day.day === "fri")?.isClosed || false,

          satStart: data.find((day) => day.day === "sat")?.startTime || "",
          satClosed: data.find((day) => day.day === "sat")?.isClosed || false,

          satEnd: data.find((day) => day.day === "sat")?.endTime || "",
          sunStart: data.find((day) => day.day === "sun")?.startTime || "",
          sunEnd: data.find((day) => day.day === "sun")?.endTime || "",
          sunClosed: data.find((day) => day.day === "sun")?.isClosed || false,
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
  // conerting string to minutes so i can compere them
  const toMinutes = (timeStr) => {
    if (!timeStr) return -1;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
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
      setRestaurantWorks("Restoran trenutno ne radi.");
      return;
    } else {
      console.log("currDateschedule ", currentDaySchedule);

      const { startTime, endTime } = currentDaySchedule;
      console.log(currTime);

      const startTimeToMinutes = toMinutes(startTime);
      const endTimeToMinutes = toMinutes(endTime);
      const currTimeToMinutes = toMinutes(currTime);

      if (
        startTime &&
        endTime &&
        currTimeToMinutes >= startTimeToMinutes &&
        currTimeToMinutes <= endTimeToMinutes
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
    const { name, value, type, checked } = e.target;
    setTimesForEachDay((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeFormSubmit = async (e) => {
    e.preventDefault();
    const formmatedData = formatForBackend(timesForEachDay);
    async function postSchedule() {
      const res = await fetch("/api/schedule", {
        method: "POST",
        body: JSON.stringify(formmatedData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Greška pri čuvanju");
      }

      return res.json();
    }
    await toast.promise(postSchedule(), {
      loading: "Čuvanje...",
      success: <b>Raspored je uspešno sačuvan!</b>,
      error: <b>Došlo je do greške.</b>,
    });
  };

  const translateToSerbian = (day) => {
    if (day == "Monday") return "Ponedeljak";
    if (day == "Tuesday") return "Utorak";
    if (day == "Wenesday") return "Sreda";
    if (day == "Thursday") return "Četvrtak";
    if (day == "Friday") return "Petak";
    if (day == "Saturday") return "Subota";
    if (day == "Sunday") return "Nedelja";
  };

  const formatForBackend = (currSchedule) => {
    const days = ["mon", "tue", "wen", "thu", "fri", "sat", "sun"];
    return days.map((day) => ({
      day,
      startTime: currSchedule[`${day}Start`] || null,
      endTime: currSchedule[`${day}End`] || null,
      isClosed: currSchedule[`${day}Closed`] || false,
    }));
  };
  return (
    <div className="w-full p-4">
      <Toaster position="top-center" reverseOrder={true} />

      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold mb-2 t uppercase text-[#172554] ">
          Raspored rada restorana
        </h2>
        <p className="text-lg text-black mb-8">
          Unesite kada ste otvoreni tokom nedelje – informacije će biti
          prikazane posetiocima.
        </p>
      </div>
      <div className="flex flex-col  gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white p-3 rounded-lg shadow">
            <form onSubmit={handleTimeFormSubmit} className="space-y-4">
              {/* <div className="grid grid-cols-4   font-semibold text-sm text-gray-700 mb-2">
                <div>Dan</div>
                <div>Zatvoreno</div>
                <div>Od</div>
                <div>Do</div>
              </div> */}
              {[
                "Monday",
                "Tuesday",
                "Wenesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, idx) => {
                const key = day.toLowerCase().slice(0, 3);
                return (
                  <div
                    key={day}
                    className={`flex   items-center  rounded-sm p-2  ${
                      timesForEachDay[`${key}Closed`]
                        ? "bg-gray-400"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-start ">
                      <input
                        type="checkbox"
                        name={`${key}Closed`}
                        className=" h-3 w-3"
                        checked={timesForEachDay[`${key}Closed`] || false}
                        onChange={handleTimeChange}
                      />
                    </div>
                    <span className="w-30 font-medium ml-2 text-black">
                      {translateToSerbian(day)}
                    </span>

                    <input
                      type="time"
                      name={`${key}Start`}
                      value={timesForEachDay[`${key}Start`] || ""}
                      onChange={handleTimeChange}
                      className="p-2 border rounded w-26 sm:ml-40 sm:w-40 ml-2  text-black"
                      disabled={timesForEachDay[`${key}Closed`]}
                    />
                    <input
                      type="time"
                      name={`${key}End`}
                      value={timesForEachDay[`${key}End`] || ""}
                      onChange={handleTimeChange}
                      className="p-2 border rounded w-26 sm:ml-6 sm:w-40 ml-1  text-black"
                      disabled={timesForEachDay[`${key}Closed`]}
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                className="mt-4 bg-[#7893c3] text-white px-4 py-2 rounded uppercase "
              >
                Sačuvaj
              </button>
            </form>
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Non-working Dates (e.g. Holidays)
            </h2>
            <div className="space-y-2">
              {holidays.map((date, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleTimeChange(e, index, "holiday")}
                    className="p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(index)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddHoliday}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Date
              </button>
            </div>
          </div> 

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Advanced Schedule (Override Regular)
            </h2>
            <div className="space-y-2">
              {specialSchedules?.map((schedule, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="date"
                    value={schedule.date}
                    onChange={(e) =>
                      handleTimeChange(e, index, "special", "date")
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) =>
                      handleTimeChange(e, index, "special", "start")
                    }
                    className="p-2 border rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) =>
                      handleTimeChange(e, index, "special", "end")
                    }
                    className="p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialSchedule(index)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSpecialSchedule}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Add Special Schedule
              </button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default WeekSchedule;
